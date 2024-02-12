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

export class CustomPromise<T = any> {
  #state: State = STATE.PENDING;

  #value?: Value<T>;

  #onfulfilledCallbacks: Callback[] = [];

  #onrejectedCallbacks: Callback[] = [];

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
      const promises = Array.from(values);

      promises
        .reduce(
          (accumulator, promise) =>
            accumulator.then((results) =>
              CustomPromise.resolve(promise).then((value) =>
                results.concat(value),
              ),
            ),
          CustomPromise.resolve([] as Awaited<T>[]),
        )
        .then((results) => {
          resolve(results);
        })
        .catch((error) => {
          reject(error);
        });
    });
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
          } else {
            reject(this.#value);
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
