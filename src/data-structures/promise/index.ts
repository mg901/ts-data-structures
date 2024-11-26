// Promises/A+ spec
// https://github.com/promises-aplus/promises-spec
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

const STATES = {
  PENDING: 'pending',
  FULFILLED: 'fulfilled',
  REJECTED: 'rejected',
} as const;

interface PromiseFulfilledResult<T> {
  status: typeof STATES.FULFILLED;
  value: T;
}

interface PromiseRejectedResult {
  status: typeof STATES.REJECTED;
  reason: any;
}

type PromiseSettledResult<T> =
  | PromiseFulfilledResult<T>
  | PromiseRejectedResult;

type QueueTask = {
  fulfilled: () => void;
  rejected: () => void;
};

export class MyPromise<T = any> implements IMyPromise<T> {
  #state: ValueOf<typeof STATES> = STATES.PENDING;

  #completed = false;

  #value: T | PromiseLike<T> | undefined = undefined;

  #reason: any = undefined;

  #callbacksQueue: QueueTask[] = [];

  // --- Resolve --------------------
  static resolve(): MyPromise<void>;
  static resolve<T>(value: T): MyPromise<Awaited<T>>;
  static resolve<T>(value: T | PromiseLike<T>): MyPromise<Awaited<T>>;
  static resolve<T>(value?: T | PromiseLike<T>) {
    if (isThenable(value)) {
      return value;
    }

    return new MyPromise<Awaited<T>>((resolve) => resolve(value as Awaited<T>));
  }

  // --- Reject --------------------
  static reject<T = never>(reason?: any) {
    return new MyPromise<T>((_, reject) => reject(reason));
  }

  // --- All --------------------
  static all<T>(values: Iterable<T | PromiseLike<T>> = []) {
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

  // --- Race --------------------
  static race<T>(values: Iterable<T | PromiseLike<T>> = []) {
    return new MyPromise<Awaited<T>>((resolve, reject) => {
      handleNonIterable(values);

      for (const value of values) {
        MyPromise.resolve(value).then(resolve, reject);
      }
    });
  }

  // --- Any --------------------
  static any<T extends readonly unknown[] | []>(
    values: T,
  ): MyPromise<Awaited<T[number]>>;
  static any<T>(values: Iterable<T | PromiseLike<T>>): MyPromise<Awaited<T>>;
  static any<T>(values: Iterable<T | PromiseLike<T>> = []) {
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

  // --- All Settled --------------------
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
          status: STATES.FULFILLED,
          value,
        }),
        (reason) => ({
          status: STATES.REJECTED,
          reason,
        }),
      ),
    );

    return MyPromise.all<PromiseSettledResult<Awaited<T>>>(items);
  }

  // --- With Resolvers --------------------
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

  // --- Constructor --------------------
  constructor(
    executor: (
      resolve: (value: T | PromiseLike<T>) => void,
      reject: (reason?: any) => void,
    ) => void,
  ) {
    // Error Handling -----
    if (new.target === undefined) {
      throw new TypeError(
        `${this.constructor.name} constructor cannot be invoked without 'new'`,
      );
    }

    if (!isFunction(executor)) {
      throw new TypeError(
        `${this.constructor.name} resolver ${type(executor)} is not a function`,
      );
    }

    // Resolve -----
    const internalResolve = (value: T | PromiseLike<T>) => {
      if (this.#completed) return;
      this.#completed = true;

      this.#state = STATES.FULFILLED;
      this.#value = value;

      this.#executeCallbacksQueue();
    };

    // Reject -----
    const internalReject = (reason: any) => {
      if (this.#completed) return;
      this.#completed = true;

      this.#state = STATES.REJECTED;
      this.#reason = reason;

      this.#executeCallbacksQueue();
    };

    // Reject -----
    const internalReject = (reason: any) => {
      if (this.#completed) return;
      this.#completed = true;

      this.#state = STATES.REJECTED;
      this.#reason = reason;

      this.#executeCallbacksQueue();
    };
    
    // Constructor execution -----
    try {
      executor(internalResolve, internalReject);
    } catch (error) {
      queueMicrotask(() => {
        internalReject(error);
      });
    }
  }

  // --- Then --------------------
  then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
  ) {
    return new MyPromise((resolve, reject) => {
      if (this.#state === STATES.PENDING) {
        this.#callbacksQueue.push({
          fulfilled: () => handleFulfilled(this.#value as T),
          rejected: () => handleRejected(this.#reason),
        });
      } else if (this.#state === STATES.FULFILLED) {
        if (isThenable(this.#value)) {
          this.#value.then(handleFulfilled, handleFulfilled);
        } else {
          handleFulfilled(this.#value as T);
        }
      } else {
        handleRejected(this.#reason);
      }

      function handleFulfilled(value: T) {
        if (isFunction(onfulfilled)) {
          queueMicrotask(() => {
            executeCallback(onfulfilled, value);
          });
        } else {
          resolve(value);
        }
      }

      function handleRejected(reason: any) {
        if (isFunction(onrejected)) {
          queueMicrotask(() => {
            executeCallback(onrejected, reason);
          });
        } else {
          reject(reason);
        }
      }

      function executeCallback(
        callback: typeof onfulfilled | typeof onrejected,
        data: any,
      ) {
        try {
          const result = callback && callback(data);

          if (isThenable(result)) {
            result.then(resolve, reject);
          } else {
            resolve(result);
          }
        } catch (error) {
          reject(error);
        }
      }
    });
  }

  #executeCallbacksQueue() {
    let index = 0;
    const chain = this.#callbacksQueue;

    while (index !== chain.length) {
      const { fulfilled, rejected } = chain[index];

      if (this.#state === STATES.FULFILLED) {
        fulfilled();
      } else {
        rejected();
      }

      index += 1;
    }

    this.#callbacksQueue = [];
  }

  // --- Catch --------------------
  catch<TResult = never>(
    onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null,
  ) {
    return this.then(null, onrejected);
  }

  // --- Finally --------------------
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

// --- Utils --------------------
function handleNonIterable(it: any): void {
  if (it[Symbol.iterator]) return;

  let prefix = `${type(it)}`;

  if (type(it) === 'number' || type(it) === 'boolean') {
    prefix += ` ${it}`;
  }

  throw new TypeError(
    `${prefix} is not iterable (cannot read property Symbol(Symbol.iterator))`,
  );
}

function isThenable(it: any): it is PromiseLike<unknown> {
  return Boolean(isObject(it) && isFunction(it.then));
}

function isObject(it: unknown) {
  return type(it) === 'object' ? it !== null : isFunction(it);
}

function isFunction(it: unknown): it is (...args: unknown[]) => unknown {
  return type(it) === 'function';
}

function type(it: unknown) {
  return typeof it;
}
