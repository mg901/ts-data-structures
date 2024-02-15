import { Queue } from '@/data-structures/queue';
import isFunction from 'lodash.isfunction';
import { ValuesType } from 'utility-types';

const STATE = {
  PENDING: 'pending',
  FULFILLED: 'fulfilled',
  REJECTED: 'rejected',
} as const;

type State = ValuesType<typeof STATE>;

type Value<T> = T | PromiseLike<T>;

type Callback = () => void;

interface PromiseFulfilledResult<T> {
  status: typeof STATE.FULFILLED;
  value: T;
}

interface PromiseRejectedResult {
  status: typeof STATE.REJECTED;
  reason: any;
}

type PromiseSettledResult<T> =
  | PromiseFulfilledResult<T>
  | PromiseRejectedResult;

export class MyPromise<T = any> {
  #state: State = STATE.PENDING;

  #value?: Value<T>;

  #onfulfilledCallbacks: Queue<Callback> = new Queue();

  #onrejectedCallbacks: Queue<Callback> = new Queue();

  static #handleNonIterable(reject: (reason: any) => void, values: any): void {
    if (!values[Symbol.iterator]) {
      reject(
        new TypeError(
          `${typeof values} is not iterable (cannot read property Symbol(Symbol.iterator))`,
        ),
      );
    }
  }

  static resolve(): MyPromise<void>;
  static resolve<T>(value: T): MyPromise<Awaited<T>>;
  static resolve<T>(value: T | PromiseLike<T>): MyPromise<Awaited<T>>;
  static resolve<T>(value?: T | PromiseLike<T>) {
    if (isMyPromise(value)) {
      return value;
    }

    return new MyPromise<Awaited<T>>((resolve) => resolve(value as Awaited<T>));
  }

  static reject<T = never>(reason?: any) {
    if (isMyPromise(reason)) {
      return reason as T;
    }

    return new MyPromise<T>((_, reject) => reject(reason));
  }

  static all<T>(values: Iterable<T | PromiseLike<T>>) {
    return new MyPromise<Awaited<T>[]>((resolve, reject) => {
      MyPromise.#handleNonIterable(reject, values);

      Array.from(values)
        .reduce<MyPromise<Awaited<T>[]>>(
          (accumulator, promise) =>
            accumulator.then((results) =>
              MyPromise.resolve(promise).then((value) => results.concat(value)),
            ),
          MyPromise.resolve([]),
        )
        .then(
          (results) => {
            resolve(results);
          },
          (error) => {
            reject(error);
          },
        );
    });
  }

  static race<T>(values: Iterable<T | PromiseLike<T>> = []) {
    return new MyPromise<Awaited<T>>((resolve, reject) => {
      MyPromise.#handleNonIterable(reject, values);

      for (const value of values) {
        MyPromise.resolve(value).then(resolve, reject);
      }
    });
  }

  static any<T extends readonly unknown[] | []>(
    values: T,
  ): MyPromise<Awaited<T[number]>>;
  static any<T>(values: Iterable<T | PromiseLike<T>>): MyPromise<Awaited<T>>;
  static any<T>(values: Iterable<T | PromiseLike<T>>) {
    const promises = Array.from(values);
    let errors: Error[] = [];

    return new MyPromise<Awaited<T>>((resolve, reject) => {
      MyPromise.#handleNonIterable(reject, values);

      for (const promise of promises) {
        MyPromise.resolve(promise).then(resolve, (error: Error) => {
          errors.push(error);

          if (errors.length === promises.length) {
            reject(new AggregateError('All promises were rejected'));
          }
        });
      }
    });
  }

  static allSettled<T extends readonly unknown[] | []>(
    values: T,
  ): MyPromise<{
    -readonly [P in keyof T]: PromiseSettledResult<Awaited<T[P]>>;
  }>;
  static allSettled<T>(
    values: Iterable<T | PromiseLike<T>>,
  ): MyPromise<PromiseSettledResult<Awaited<T>>[]>;
  static allSettled<T>(values: Iterable<T | PromiseLike<T>> = []) {
    return MyPromise.all<PromiseSettledResult<Awaited<T>>>(
      Array.from(values).map((promise) =>
        MyPromise.resolve(promise).then(
          (value) => ({
            status: STATE.FULFILLED,
            value,
          }),
          (error) => ({
            status: STATE.REJECTED,
            reason: error,
          }),
        ),
      ),
    );
  }

  static #processCallbackQueue(queue: Queue<Callback>) {
    for (const callback of queue) {
      queueMicrotask(() => callback());
    }

    queue.clear();
  }

  constructor(
    executor: (
      resolve: (value: T | PromiseLike<T>) => void,
      reject: (reason?: any) => void,
    ) => void,
  ) {
    try {
      executor(this.#resolve.bind(this), this.#reject.bind(this));
    } catch (error) {
      this.#reject(error);
    }
  }

  #resolve(value: Value<T>) {
    if (this.#state === STATE.PENDING) {
      this.#state = STATE.FULFILLED;
      this.#value = value;

      MyPromise.#processCallbackQueue(this.#onfulfilledCallbacks);
    }
  }

  #reject(reason?: any) {
    if (this.#state === STATE.PENDING) {
      this.#state = STATE.REJECTED;
      this.#value = reason;

      MyPromise.#processCallbackQueue(this.#onrejectedCallbacks);
    }
  }

  then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
  ) {
    return new MyPromise<TResult1 | TResult2>((resolve, reject) => {
      type Handler = typeof onfulfilled | typeof onrejected;

      const executeHandler = (handler: Handler) => {
        try {
          if (isFunction(handler)) {
            const result = handler(this.#value as T);

            if (isMyPromise(result)) {
              result.then(resolve, reject);
            } else {
              resolve(result);
            }
          } else if (this.#state === STATE.FULFILLED) {
            resolve(this.#value as TResult1 | TResult2);
          } else {
            reject(this.#value);
          }
        } catch (error) {
          reject(error);
        }
      };

      const handlers = {
        [STATE.PENDING]: () => {
          this.#onfulfilledCallbacks.enqueue(() => executeHandler(onfulfilled));
          this.#onrejectedCallbacks.enqueue(() => executeHandler(onrejected));
        },
        [STATE.FULFILLED]: () => executeHandler(onfulfilled),
        [STATE.REJECTED]: () => executeHandler(onrejected),
      };

      handlers[this.#state]();
    });
  }

  catch<TResult = never>(
    onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null,
  ) {
    return this.then(null, onrejected);
  }

  finally(onfinally?: (() => void) | undefined | null) {
    return this.then(
      (value) => {
        if (isFunction(onfinally)) {
          onfinally();
        }

        return value;
      },
      (reason) => {
        if (isFunction(onfinally)) {
          onfinally();
        }

        return reason;
      },
    );
  }
}

function isMyPromise(value: any): value is MyPromise {
  return value instanceof MyPromise;
}
