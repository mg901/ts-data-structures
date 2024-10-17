// Promises/A+ spec
// https://github.com/promises-aplus/promises-spec

import { Queue } from '@/data-structures/queue';
import isFunction from 'lodash.isfunction';
import { ValueOf } from 'type-fest';

/**
 * Represents the completion of an asynchronous operation
 */
interface IMyPromise<T> {
  /**
   * Attaches callbacks for the resolution and/or rejection of the MyPromise.
   * @param onfulfilled The callback to execute when the MyPromise is resolved.
   * @param onrejected The callback to execute when the MyPromise is rejected.
   * @returns A MyPromise for the completion of which ever callback is executed.
   */
  then<TResult1 = T, TResult2 = never>(
    onfulfilled?:
      | ((value: T) => TResult1 | PromiseLike<TResult1>)
      | undefined
      | null,
    onrejected?:
      | ((reason: any) => TResult2 | PromiseLike<TResult2>)
      | undefined
      | null,
  ): IMyPromise<TResult1 | TResult2>;

  /**
   * Attaches a callback for only the rejection of the MyPromise.
   * @param onrejected The callback to execute when the MyPromise is rejected.
   * @returns A MyPromise for the completion of the callback.
   */
  catch<TResult = never>(
    onrejected?:
      | ((reason: any) => TResult | PromiseLike<TResult>)
      | undefined
      | null,
  ): IMyPromise<T | TResult>;

  /**
   * Attaches a callback that is invoked when the MyPromise is settled (fulfilled or rejected). The
   * resolved value cannot be modified from the callback.
   * @param onfinally The callback to execute when the MyPromise is settled (fulfilled or rejected).
   * @returns A MyPromise for the completion of the callback.
   */
  finally(onfinally?: (() => void) | undefined | null): IMyPromise<T>;

  readonly [Symbol.toStringTag]: string;
}

const STATE = {
  PENDING: 'pending',
  FULFILLED: 'fulfilled',
  REJECTED: 'rejected',
} as const;

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

export class MyPromise<T = any> implements IMyPromise<T> {
  #state: ValueOf<typeof STATE> = STATE.PENDING;

  #value?: T | PromiseLike<T>;

  #onfulfilledCallbacks = new Queue<Callback>();

  #onrejectedCallbacks = new Queue<Callback>();

  static resolve(): MyPromise<void>;
  static resolve<T>(value: T): MyPromise<Awaited<T>>;
  static resolve<T>(value: T | PromiseLike<T>): MyPromise<Awaited<T>>;
  static resolve<T>(value?: T | PromiseLike<T>) {
    if (isThenable(value)) {
      return value;
    }

    return new MyPromise<Awaited<T>>((resolve) => resolve(value as Awaited<T>));
  }

  static reject<T = never>(reason?: any) {
    return new MyPromise<T>((_, reject) => reject(reason));
  }

  static all<T>(values: Iterable<T | PromiseLike<T>>) {
    return new MyPromise<Awaited<T>[]>((resolve, reject) => {
      handleNonIterable(values);

      const items = Array.from(values);
      let unresolved = items.length;

      handleResolvedPromises();

      items.forEach((item, index) => {
        MyPromise.resolve(item).then(
          (value) => {
            items[index] = value;
            unresolved -= 1;

            handleResolvedPromises();
          },
          (reason) => {
            reject(reason);
          },
        );
      });

      function handleResolvedPromises() {
        if (unresolved === 0) {
          resolve(items as Awaited<T>[]);
        }
      }
    });
  }

  static race<T>(values: Iterable<T | PromiseLike<T>> = []) {
    return new MyPromise<Awaited<T>>((resolve, reject) => {
      handleNonIterable(values);

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
    return new MyPromise<Awaited<T>>((resolve, reject) => {
      handleNonIterable(values);

      const items = Array.from(values);
      let resolved = items.length;
      let errors: Error[] = new Array(items.length);

      handleRejectedPromises();

      items.forEach((item, index) => {
        MyPromise.resolve(item).then(
          (result) => {
            resolve(result);
          },
          (reason) => {
            errors[index] = reason;
            resolved -= 1;

            handleRejectedPromises();
          },
        );
      });

      function handleRejectedPromises() {
        if (resolved === 0) {
          reject(new AggregateError(errors, 'All promises were rejected'));
        }
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
    const items = Array.from(values).map((item) =>
      MyPromise.resolve(item).then(
        (value) => ({
          status: STATE.FULFILLED,
          value,
        }),
        (error) => ({
          status: STATE.REJECTED,
          reason: error,
        }),
      ),
    );

    return MyPromise.all<PromiseSettledResult<Awaited<T>>>(items);
  }

  static withResolvers<T>() {
    let resolve!: (value: T | PromiseLike<T>) => void;
    let reject!: (reason?: any) => void;

    const promise = new MyPromise<T>((res, rej) => {
      resolve = res;
      reject = rej;
    });

    return {
      promise,
      resolve,
      reject,
    };
  }

  constructor(
    executor: (
      resolve: (value: T | PromiseLike<T>) => void,
      reject: (reason?: any) => void,
    ) => void,
  ) {
    if (new.target === undefined) {
      throw new TypeError(
        `${this.constructor.name} constructor cannot be invoked without 'new'`,
      );
    }

    if (typeof executor !== 'function') {
      throw new TypeError(
        `${this.constructor.name} resolver ${typeof executor} is not a function`,
      );
    }

    try {
      executor(this.#resolve.bind(this), this.#reject.bind(this));
    } catch (error) {
      this.#reject(error);
    }
  }

  #resolve(value: T | PromiseLike<T>) {
    if (this.#state === STATE.PENDING) {
      if (isThenable(value)) {
        queueMicrotask(() => {
          value.then(this.#resolve.bind(this), this.#reject.bind(this));
        });
      } else {
        this.#state = STATE.FULFILLED;
        this.#value = value;
      }

      executeCallbacks(this.#onfulfilledCallbacks);
      this.#onfulfilledCallbacks.clear();
    }
  }

  #reject(reason?: any) {
    if (this.#state === STATE.PENDING) {
      this.#state = STATE.REJECTED;
      this.#value = reason;

      executeCallbacks(this.#onrejectedCallbacks);
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

            if (isThenable(result)) {
              queueMicrotask(() => {
                result.then(resolve, reject);
              });
            } else {
              resolve(result);
            }
          } else if (this.#state === STATE.FULFILLED) {
            resolve(this.#value as TResult1);
          } else {
            reject(this.#value);
          }
        } catch (error) {
          reject(error);
        }
      };

      const strategy = {
        [STATE.PENDING]: () => {
          this.#onfulfilledCallbacks.enqueue(() => executeHandler(onfulfilled));
          this.#onrejectedCallbacks.enqueue(() => executeHandler(onrejected));
        },
        [STATE.FULFILLED]: () => {
          queueMicrotask(() => {
            executeHandler(onfulfilled);
          });
        },
        [STATE.REJECTED]: () => {
          queueMicrotask(() => {
            executeHandler(onrejected);
          });
        },
      };

      strategy[this.#state]();
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

  get [Symbol.toStringTag]() {
    return `${this.constructor.name}`;
  }
}

function handleNonIterable(it: any): void {
  if (it[Symbol.iterator]) return;

  let type = typeof it;
  let prefix = `${type}`;

  if (type === 'number' || type === 'boolean') {
    prefix += ` ${it}`;
  }

  throw new TypeError(
    `${prefix} is not iterable (cannot read property Symbol(Symbol.iterator))`,
  );
}

function isThenable(it: any): it is PromiseLike<any> {
  return !!(it && isFunction(it.then));
}

function executeCallbacks(queue: Queue<Callback>) {
  for (const callback of queue) {
    queueMicrotask(() => {
      callback();
    });
  }
}
