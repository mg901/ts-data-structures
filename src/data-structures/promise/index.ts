import isFunction from 'lodash.isfunction';
import { ValuesType } from 'utility-types';

type Value<T> = T | PromiseLike<T>;

type WrappedHandler = () => void;

const STATE = {
  PENDING: 'pending',
  FULFILLED: 'fulfilled',
  REJECTED: 'rejected',
} as const;

type State = ValuesType<typeof STATE>;

export class CustomPromise<T = any> {
  #state: State = STATE.PENDING;

  #value?: Value<T>;

  #onfulfilledHandlers: WrappedHandler[] = [];

  #onrejectedHandlers: WrappedHandler[] = [];

  // eslint-disable-next-line @typescript-eslint/no-shadow
  static reject = <T = never>(reason: any) => {
    return new CustomPromise<T>((_, reject) => reject(reason));
  };

  static resolve(): CustomPromise<void>;
  static resolve<T>(value: T): CustomPromise<Awaited<T>>;
  static resolve<T>(value: T | PromiseLike<T>): CustomPromise<Awaited<T>>;
  static resolve<T>(value?: T | PromiseLike<T>) {
    return new CustomPromise((resolve) =>
      resolve(value as Awaited<T> | PromiseLike<Awaited<T>>),
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

      this.#onfulfilledHandlers.forEach((handler) => {
        queueMicrotask(() => handler());
      });

      this.#onfulfilledHandlers = [];
    }
  }

  #reject(reason?: any) {
    if (this.#state === STATE.PENDING) {
      this.#state = STATE.REJECTED;
      this.#value = reason;

      this.#onrejectedHandlers.forEach((handler) => {
        queueMicrotask(() => handler());
      });

      this.#onrejectedHandlers = [];
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
            if (result instanceof CustomPromise) {
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
          this.#onfulfilledHandlers.push(() => executeHandler(onfulfilled));
          this.#onrejectedHandlers.push(() => executeHandler(onrejected));
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
}
