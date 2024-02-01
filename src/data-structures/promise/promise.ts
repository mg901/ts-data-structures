type ResolveFn<T> = (value?: T | PromiseLike<T>) => void;
type ResolveFnValue<T> = Parameters<ResolveFn<T>>[0];
type RejectFn = (reason?: any) => void;

type Executor<T> = (resolve: ResolveFn<T>, reject: RejectFn) => void;

type FinallyCallback<T> = () => T | PromiseLike<T>;

type Callback<T = any, U = any> = (value?: T) => U | PromiseLike<U>;

const STATE = {
  PENDING: 'PENDING',
  FULFILLED: 'FULFILLED',
  REJECTED: 'REJECTED',
} as const;

type PromiseState = keyof typeof STATE;

export class CustomPromise<T = any> {
  #state: PromiseState = STATE.PENDING;

  #value?: T;

  #reason: any;

  #onFulfilledCallbacks: Callback<T, any>[] = [];

  #onRejectedCallbacks: Callback<any, any>[] = [];

  #finallyCallbacks: FinallyCallback<any>[] = [];

  constructor(executor: Executor<T>) {
    try {
      executor(this.#resolve.bind(this), this.#reject.bind(this));
    } catch (error) {
      this.#reject(error);
    }
  }

  static #isPromise(result: unknown): result is CustomPromise {
    return result instanceof CustomPromise;
  }

  #resolve(value?: ResolveFnValue<T>) {
    if (this.#state === STATE.PENDING) {
      this.#state = STATE.FULFILLED;
      this.#value = value as T;
      this.#onFulfilledCallbacks.forEach((callback) =>
        queueMicrotask(() => callback(this.#value)),
      );
      this.#finallyCallbacks.forEach((callback) => queueMicrotask(callback));
    }
  }

  #reject(reason?: any) {
    if (this.#state === STATE.PENDING) {
      this.#state = STATE.REJECTED;
      this.#reason = reason;
      this.#onRejectedCallbacks.forEach((callback) =>
        queueMicrotask(() => callback(this.#reason)),
      );
      this.#finallyCallbacks.forEach((callback) =>
        queueMicrotask(() => callback),
      );
    }
  }

  then<U>(onFulfilled: Callback<T, U>, onRejected: Callback<any, U>) {
    return new CustomPromise<U>((resolve, reject) => {
      const handlers = {
        [STATE.PENDING]: () => {
          this.#onFulfilledCallbacks.push(onFulfilledWrapper);
          this.#onRejectedCallbacks.push(onRejectedWrapper);
        },
        [STATE.FULFILLED]: () => {
          queueMicrotask(() => onFulfilledWrapper(this.#value));
        },
        [STATE.REJECTED]: () => {
          queueMicrotask(() => onRejectedWrapper(this.#reason));
        },
      };

      handlers[this.#state]();

      function onFulfilledWrapper(value?: T) {
        try {
          if (isFunction(onFulfilled)) {
            const result = onFulfilled(value);

            if (CustomPromise.#isPromise(result)) {
              result.then(resolve, reject);
            }

            resolve(result);
          } else {
            resolve(value as U);
          }
        } catch (error) {
          reject(error);
        }
      }

      function onRejectedWrapper(reason?: any) {
        try {
          if (isFunction(onRejected)) {
            const result = onRejected(reason);

            if (CustomPromise.#isPromise(result)) {
              result.then(resolve, reject);
            }

            resolve(result);
          } else {
            reject(reason);
          }
        } catch (error) {
          reject(error);
        }
      }
    });
  }
}

function isFunction(callback: unknown): callback is Callback {
  return typeof callback === 'function';
}
