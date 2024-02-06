type ValueOf<T> = T[keyof T];

type Value<T> = T | PromiseLike<T>;

type Handler = () => void;

type OnFulfilled<T, Result> = ((value: T) => Value<Result>) | null;

type OnRejected<Result> = ((reason: any) => Value<Result>) | null;

const STATE = {
  PENDING: 'pending',
  FULFILLED: 'fulfilled',
  REJECTED: 'rejected',
} as const;

type State = ValueOf<typeof STATE>;

export class CustomPromise<T = any> {
  #state: State = STATE.PENDING;

  #value?: Value<T>;

  #onfulfilledHandlers: Handler[] = [];

  #onrejectedHandlers: Handler[] = [];

  static resolve(): CustomPromise<void>;
  static resolve<T>(value: T): CustomPromise<Awaited<T>>;
  static resolve<T>(value: T | PromiseLike<T>): CustomPromise<Awaited<T>>;
  static resolve<T>(value?: T | PromiseLike<T>) {
    return new CustomPromise((resolve) =>
      resolve(value as Awaited<T> | PromiseLike<Awaited<T>>),
    );
  }

  static reject = <U = never>(reason: any) => {
    return new CustomPromise<U>((_, reject) => reject(reason));
  };

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
    onfulfilled?: OnFulfilled<T, TResult1>,
    onrejected?: OnRejected<TResult2>,
  ) {
    return new CustomPromise<TResult1 | TResult2>((resolve, reject) => {
      const executeHandler = (
        handler: typeof onfulfilled | typeof onrejected,
      ) => {
        try {
          if (typeof handler === 'function') {
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
}
