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

const PROMISE_STATES = {
  PENDING: 'pending',
  FULFILLED: 'fulfilled',
  REJECTED: 'rejected',
} as const;

const PROMISE_REACTION_TYPES = {
  FULFILL: 'fulfill',
  REJECT: 'reject',
} as const;

interface PromiseFulfilledResult<T> {
  status: typeof PROMISE_STATES.FULFILLED;
  value: T;
}

interface PromiseRejectedResult {
  status: typeof PROMISE_STATES.REJECTED;
  reason: any;
}

type PromiseSettledResult<T> =
  | PromiseFulfilledResult<T>
  | PromiseRejectedResult;

type PromiseCapability<T> = {
  promise: IMyPromise<T>;
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: any) => void;
};

type FulfillPromiseReaction<T = any> = {
  capability: PromiseCapability<T>;
  type: typeof PROMISE_REACTION_TYPES.FULFILL;
  handler: ((value: T) => T | PromiseLike<T>) | null;
};

type RejectPromiseReaction<T = any> = {
  capability: PromiseCapability<T>;
  type: typeof PROMISE_REACTION_TYPES.REJECT;
  handler: ((reason: any) => T | PromiseLike<T>) | null;
};

export class MyPromise<T = any> implements IMyPromise<T> {
  #state: ValueOf<typeof PROMISE_STATES> = PROMISE_STATES.PENDING;

  #value: T | PromiseLike<T> | undefined = undefined;

  #fulfillReactions: FulfillPromiseReaction<T>[] | undefined = [];

  #rejectReactions: RejectPromiseReaction<T>[] | undefined = [];

  #alreadyResolved = false;

  #isHandled = false;

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
    if (!isIterable(values)) {
      return MyPromise.reject(createNonIterableError(values));
    }

    return new MyPromise((resolve, reject) => {
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
          resolve(items);
        }
      }
    });
  }

  // --- Race --------------------
  static race<T>(values: Iterable<T | PromiseLike<T>> = []) {
    if (!isIterable(values)) {
      return MyPromise.reject(createNonIterableError(values));
    }

    return new MyPromise<Awaited<T>>((resolve, reject) => {
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
    if (!isIterable(values)) {
      return MyPromise.reject(createNonIterableError(values));
    }

    return new MyPromise<Awaited<T>>((resolve, reject) => {
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
    if (!isIterable(values)) {
      return MyPromise.reject(createNonIterableError(values));
    }

    const items = Array.from(values).map((item) =>
      MyPromise.resolve(item).then(
        (value) => ({
          status: PROMISE_STATES.FULFILLED,
          value,
        }),
        (reason) => ({
          status: PROMISE_STATES.REJECTED,
          reason,
        }),
      ),
    );

    return MyPromise.all<PromiseSettledResult<Awaited<T>>>(items);
  }

  // --- With Resolvers --------------------
  static withResolvers<T>() {
    return newPromiseCapability<T>(MyPromise);
  }

  // --- Species
  // specification reference: https://tc39.es/ecma262/#sec-get-promise-%25symbol.species%25
  static get [Symbol.species]() {
    return this;
  }

  // --- Constructor --------------------
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

    if (!isCallable(executor)) {
      throw new TypeError(
        `${this.constructor.name} resolver ${typeof executor} is not a function`,
      );
    }

    // https://tc39.es/ecma262/#sec-rejectpromise
    const rejectPromise = (reason: any) => {
      assertPromiseStatePending(this.#state !== PROMISE_STATES.PENDING);

      const reactions = this.#rejectReactions;
      this.#value = reason;
      this.#fulfillReactions = undefined;
      this.#rejectReactions = undefined;
      this.#state = PROMISE_STATES.REJECTED;

      triggerPromiseReactions(reactions!, reason);
    };

    // Reject -----
    // https://tc39.es/ecma262/#sec-promise-reject-functions
    const reject = (reason: any) => {
      if (this.#alreadyResolved) return;
      this.#alreadyResolved = true;

      rejectPromise(reason);
    };

    // https://tc39.es/ecma262/#sec-fulfillpromise
    const fulfillPromise = (value: T | PromiseLike<T>) => {
      assertPromiseStatePending(this.#state !== PROMISE_STATES.PENDING);

      const reactions = this.#fulfillReactions;
      this.#value = value;
      this.#fulfillReactions = undefined;
      this.#rejectReactions = undefined;
      this.#state = PROMISE_STATES.FULFILLED;

      triggerPromiseReactions(reactions!, value);
    };

    //  Resolve -----
    // https://tc39.es/ecma262/#sec-promise-resolve-functions
    const resolve = (resolution: T | PromiseLike<T>) => {
      const promise = this;

      if (this.#alreadyResolved) return;
      this.#alreadyResolved = true;

      if (resolution === promise) {
        throw new TypeError(
          `Chaining cycle detected for promise #<${promise.constructor.name}>`,
        );
      }

      if (!isObject(resolution)) {
        fulfillPromise(resolution);

        return;
      }

      try {
        const thenAction = (resolution as PromiseLike<T>).then;

        if (!isCallable(thenAction)) {
          fulfillPromise(resolution);

          return;
        }

        // https://tc39.es/ecma262/#sec-newpromiseresolvethenablejob
        hostEnqueuePromiseJob(() => {
          try {
            thenAction.call(resolution, fulfillPromise, rejectPromise);
          } catch (error) {
            rejectPromise(error);
          }
        });
      } catch (error) {
        rejectPromise(error);
      }
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  // --- Then --------------------
  then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
  ) {
    const promiseCapability = newPromiseCapability<TResult1 | TResult2>(
      MyPromise,
    );
    const onFulfilledCallback = !isCallable(onfulfilled) ? null : onfulfilled;
    const onRejectedCallback = !isCallable(onrejected) ? null : onrejected;

    const fulfillReaction: FulfillPromiseReaction = {
      capability: promiseCapability,
      type: PROMISE_REACTION_TYPES.FULFILL,
      handler: onFulfilledCallback,
    };

    const rejectReaction: RejectPromiseReaction = {
      capability: promiseCapability,
      type: PROMISE_REACTION_TYPES.REJECT,
      handler: onRejectedCallback,
    };

    if (this.#state === PROMISE_STATES.PENDING) {
      this.#fulfillReactions!.push(fulfillReaction);
      this.#rejectReactions!.push(rejectReaction);
    } else if (this.#state === PROMISE_STATES.FULFILLED) {
      promiseReactionJob(fulfillReaction, this.#value);
    } else {
      promiseReactionJob(rejectReaction, this.#value);
    }

    this.#isHandled = true;

    return promiseCapability.promise;
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
        if (isCallable(onfinally)) {
          onfinally();
        }

        return value;
      },
      (reason) => {
        if (isCallable(onfinally)) {
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

function triggerPromiseReactions(
  reactions: (FulfillPromiseReaction | RejectPromiseReaction)[],
  argument: any,
) {
  for (const reaction of reactions) {
    promiseReactionJob(reaction, argument);
  }
}

function promiseReactionJob(
  reaction: FulfillPromiseReaction | RejectPromiseReaction,
  argument: any,
) {
  return hostEnqueuePromiseJob(() => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const { capability, type, handler } = reaction;
    const { resolve, reject } = capability;

    if (handler == null) {
      if (type === PROMISE_REACTION_TYPES.FULFILL) {
        resolve(argument);
      } else {
        reject(argument);
      }

      return;
    }

    try {
      const result = handler(argument);

      if (isThenable(result)) {
        result.then(resolve, reject);
      } else {
        resolve(result);
      }
    } catch (error) {
      reject(error);
    }
  });
}

function hostEnqueuePromiseJob(job: () => void) {
  queueMicrotask(job);
}

// --- Utils --------------------
function assertPromiseStatePending(condition: boolean) {
  if (condition) {
    throw new TypeError('Promise state must be pending.');
  }
}

function isIterable(it: any) {
  return Boolean(it[Symbol.iterator]);
}

function createNonIterableError(it: any) {
  let prefix = `${type(it)}`;

  if (type(it) === 'number' || type(it) === 'boolean') {
    prefix += ` ${it}`;
  }

  // eslint-disable-next-line consistent-return
  return TypeError(
    `${prefix} is not iterable (cannot read property Symbol(Symbol.iterator))`,
  );
}

function newPromiseCapability<T>(C: typeof MyPromise) {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: any) => void;

  const promise = new C<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return {
    promise,
    resolve,
    reject,
  };
}

function isThenable(it: any): it is PromiseLike<unknown> {
  return isObject(it) && isCallable(it.then);
}

function isObject(it: unknown) {
  return type(it) === 'object' ? it !== null : isCallable(it);
}

function isCallable(it: unknown): it is (...args: any[]) => any {
  return type(it) === 'function';
}

function type(it: unknown) {
  return typeof it;
}
