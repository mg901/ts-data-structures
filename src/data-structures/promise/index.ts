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

export class CustomPromise<T = any> {
  #state: State = STATE.PENDING;

  #value?: Value<T>;

  #onfulfilledCallbacks: Callback[] = [];

  #onrejectedCallbacks: Callback[] = [];

  static #handleNonIterable(reject: (reason: any) => void, values: any): void {
    if (!values[Symbol.iterator]) {
      reject(
        new TypeError(
          `${typeof values} is not iterable (cannot read property Symbol(Symbol.iterator))`,
        ),
      );
    }
  }

  static resolve(): CustomPromise<void>;
  static resolve<T>(value: T): CustomPromise<Awaited<T>>;
  static resolve<T>(value: T | PromiseLike<T>): CustomPromise<Awaited<T>>;
  static resolve<T>(value?: T | PromiseLike<T>) {
    if (isCustomPromise(value)) {
      return value;
    }

    return new CustomPromise<Awaited<T>>((resolve) =>
      resolve(value as Awaited<T>),
    );
  }

  static reject<T = never>(reason?: any) {
    if (isCustomPromise(reason)) {
      return reason as T;
    }

    return new CustomPromise<T>((_, reject) => reject(reason));
  }

  static all<T>(values: Iterable<T | PromiseLike<T>>) {
    return new CustomPromise<Awaited<T>[]>((resolve, reject) => {
      CustomPromise.#handleNonIterable(reject, values);

      const promises = Array.from(values);

      promises
        .reduce<CustomPromise<Awaited<T>[]>>(
          (accumulator, promise) =>
            accumulator.then((results) =>
              CustomPromise.resolve(promise).then((value) =>
                results.concat(value),
              ),
            ),
          CustomPromise.resolve([]),
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
    return new CustomPromise<Awaited<T>>((resolve, reject) => {
      CustomPromise.#handleNonIterable(reject, values);

      for (const value of values) {
        CustomPromise.resolve(value).then(resolve, reject);
      }
    });
  }

  static any<T extends readonly unknown[] | []>(
    values: T,
  ): CustomPromise<Awaited<T[number]>>;
  static any<T>(
    values: Iterable<T | PromiseLike<T>>,
  ): CustomPromise<Awaited<T>>;
  static any<T>(values: Iterable<T | PromiseLike<T>>) {
    assertIterable(values);

    const promises = Array.from(values);
    let errors: Error[] = [];

    return new CustomPromise<Awaited<T>>((resolve, reject) => {
      for (const promise of promises) {
        CustomPromise.resolve(promise).then(resolve, (error: Error) => {
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
  ): CustomPromise<{
    -readonly [P in keyof T]: PromiseSettledResult<Awaited<T[P]>>;
  }>;
  static allSettled<T>(
    values: Iterable<T | PromiseLike<T>>,
  ): CustomPromise<PromiseSettledResult<Awaited<T>>[]>;
  static allSettled<T>(values: Iterable<T | PromiseLike<T>> = []) {
    return CustomPromise.all<PromiseSettledResult<Awaited<T>>>(
      Array.from(values).map((promise) =>
        CustomPromise.resolve(promise).then(
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

      this.#onfulfilledCallbacks.forEach((callback) => {
        queueMicrotask(() => callback());
      });

      this.#onfulfilledCallbacks = [];
    }
  }

  #reject(reason?: any) {
    if (this.#state === STATE.PENDING) {
      this.#state = STATE.REJECTED;
      this.#value = reason;

      this.#onrejectedCallbacks.forEach((callback) => {
        queueMicrotask(() => callback());
      });

      this.#onrejectedCallbacks = [];
    }
  }

  then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
  ) {
    return new CustomPromise<TResult1 | TResult2>((resolve, reject) => {
      type Handler = typeof onfulfilled | typeof onrejected;

      const executeHandler = (handler: Handler) => {
        try {
          if (isFunction(handler)) {
            const result = handler(this.#value as T);

            if (isCustomPromise(result)) {
              result.then(resolve, reject);
            } else {
              resolve(result);
            }
          } else if (this.#state === STATE.FULFILLED) {
            resolve(this.#value as TResult1);
          } else {
            resolve(this.#value as TResult1 | TResult2);
          }
        } catch (error) {
          reject(error);
        }
      };

      const handlers = {
        [STATE.PENDING]: () => {
          this.#onfulfilledCallbacks.push(() => executeHandler(onfulfilled));
          this.#onrejectedCallbacks.push(() => executeHandler(onrejected));
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

function isCustomPromise(value: any): value is CustomPromise {
  return value instanceof CustomPromise;
}

const assertIterable = (value: any) => {
  if (!value[Symbol.iterator]) {
    throw new TypeError(
      `${typeof value} is not iterable (cannot read property Symbol(Symbol.iterator))`,
    );
  }
};
