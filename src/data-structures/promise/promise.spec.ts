import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type Mock,
} from 'vitest';
import { MyPromise } from './index';

const PROMISE_STATES = {
  PENDING: 'pending',
  FULFILLED: 'fulfilled',
  REJECTED: 'rejected',
} as const;

const SUCCESS_VALUE = 'value';
const ERROR_MESSAGE = 'test error';
const REASON = Error(ERROR_MESSAGE);
const DELAY = 100;

describe('MyPromise', () => {
  let onfulfilled: any;
  let onrejected: any;

  beforeEach(() => {
    onfulfilled = vi.fn();
    onrejected = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('executor', () => {
    let executorSpy: Mock;

    // Arrange
    beforeEach(() => {
      executorSpy = vi.fn();
    });

    it("throws a TypeError when called without 'new'", () => {
      // Act
      const wrapper = () => {
        // @ts-ignore
        MyPromise();
      };

      // Assert
      expect(wrapper).toThrowError(
        new TypeError(
          "Class constructor MyPromise cannot be invoked without 'new'",
        ),
      );
    });

    it.each([null, undefined, 42, 'string', {}, []])(
      'throws a TypeError when executor is %p',
      (executor: any) => {
        // Act and Assert
        expect(() => new MyPromise(executor)).toThrowError(
          new TypeError(
            `MyPromise resolver ${typeof executor} is not a function`,
          ),
        );
      },
    );

    it('handles executor function', async () => {
      expect.assertions(2);

      // Arrange
      const executor = executorSpy.mockImplementation((resolve) =>
        resolve(SUCCESS_VALUE),
      );

      // Act
      const received = await new MyPromise<string>(executor);

      // Assert
      expect(received).toEqual(SUCCESS_VALUE);
      expect(executor).toHaveBeenCalledOnce();
    });

    it('handles executor function throwing error', async () => {
      expect.assertions(2);

      // Arrange
      const executor = executorSpy.mockImplementation(() => {
        throw new Error(ERROR_MESSAGE);
      });

      try {
        // Act
        await new MyPromise<string>(executor);
      } catch (error: any) {
        // Assert
        expect(error.message).toBe(ERROR_MESSAGE);
      }

      // Assert
      expect(executor).toHaveBeenCalledOnce();
    });
  });

  describe('then', () => {
    it('calls onfulfilled when the promise is fulfilled', async () => {
      expect.assertions(3);
      // Arrange
      const promise = new MyPromise((resolve) => {
        resolve(SUCCESS_VALUE);
      });

      // Act
      await promise.then(onfulfilled, onrejected);

      // Assert
      expect(onfulfilled).toHaveBeenCalledOnce();
      expect(onfulfilled).toHaveBeenCalledWith(SUCCESS_VALUE);

      expect(onrejected).not.toHaveBeenCalled();
    });

    it('rejects when an error is thrown in onfulfilled', async () => {
      expect.assertions(3);

      // Arrange
      onfulfilled = vi.fn(() => {
        throw new Error(ERROR_MESSAGE);
      });

      const promise = new MyPromise((resolve) => {
        resolve(SUCCESS_VALUE);
      });

      // Act
      await promise.then(onfulfilled, onrejected).then(null, (reason) => {
        expect(reason).toEqual(new Error(ERROR_MESSAGE));
      });

      // Assert
      expect(onfulfilled).toHaveBeenCalledOnce();
      expect(onrejected).not.toHaveBeenCalled();
    });

    it('continues without error if onfulfilled and onrejected are not functions', async () => {
      expect.assertions(3);

      // Arrange
      const promise = new MyPromise((resolve) => {
        resolve(SUCCESS_VALUE);
      });

      // Act and Assert
      await expect(promise.then(null, null)).resolves.toBe(SUCCESS_VALUE);
      await expect(promise.then(null, undefined)).resolves.toBe(SUCCESS_VALUE);
      await expect(promise.then(undefined, undefined)).resolves.toBe(
        SUCCESS_VALUE,
      );
    });

    it('continues without error if onfulfilled is not a function', async () => {
      expect.assertions(1);
      // Arrange
      const promise = new MyPromise((resolve) => {
        resolve(SUCCESS_VALUE);
      });

      // Act and Assert
      // @ts-ignore
      await expect(promise.then('not a function')).resolves.toBe(SUCCESS_VALUE);
    });

    it('calls onrejected when the promise is rejected', async () => {
      expect.assertions(2);

      // Arrange
      const promise = new MyPromise((_, reject) => {
        reject(REASON);
      });

      // Act
      await promise.then(null, onrejected);

      // Assert
      expect(onrejected).toHaveBeenCalledOnce();
      expect(onrejected).toHaveBeenCalledWith(REASON);
    });

    it('calls onfulfilled with the nested promise value', async () => {
      expect.assertions(3);

      // Arrange
      const nestedPromise = new MyPromise((resolve) => {
        resolve(SUCCESS_VALUE);
      });

      await new MyPromise((resolve) => {
        resolve(nestedPromise);
      })
        // Act
        .then(onfulfilled, onrejected);

      // Assert
      expect(onfulfilled).toHaveBeenCalledWith(SUCCESS_VALUE);
      expect(onfulfilled).toHaveBeenCalledOnce();

      expect(onrejected).not.toHaveBeenCalled();
    });

    it('ignores non-function callbacks and continues with resolved value', async () => {
      expect.assertions(2);
      // Arrange
      const promise = new MyPromise<string>((resolve) => {
        resolve(SUCCESS_VALUE);
      });

      await promise
        .then(null)
        .then(null)
        .then(null)
        .then(null)
        .then(onfulfilled);

      expect(onfulfilled).toHaveBeenCalledOnce();
      expect(onfulfilled).toHaveBeenCalledWith(SUCCESS_VALUE);
    });

    it('ignores non-function callbacks and continues with rejected value', async () => {
      expect.assertions(2);

      // Arrange
      const promise = new MyPromise<string>((_, reject) => {
        reject(REASON);
      });

      await promise
        .then(null, null)
        .then(null, null)
        .then(null, null)
        .then(null, onrejected);

      expect(onrejected).toHaveBeenCalledOnce();
      expect(onrejected).toHaveBeenCalledWith(REASON);
    });

    it('resolves asynchronously with correct value', async () => {
      expect.assertions(3);

      // Arrange
      const promise = new MyPromise((resolve) => {
        setTimeout(resolve, DELAY, SUCCESS_VALUE);
      });

      // Act
      await promise.then(onfulfilled, onrejected);

      // Assert
      expect(onrejected).not.toHaveBeenCalled();
      expect(onfulfilled).toHaveBeenCalledOnce();
      expect(onfulfilled).toHaveBeenCalledWith(SUCCESS_VALUE);
    });

    it('rejects asynchronously with correct reason', async () => {
      expect.assertions(3);

      // Arrange
      const promise = new MyPromise((_, reject) => {
        setTimeout(reject, DELAY, REASON);
      });

      // Act
      await promise.then(onfulfilled, onrejected);

      // Assert
      expect(onfulfilled).not.toHaveBeenCalledOnce();
      expect(onrejected).toHaveBeenCalledOnce();
      expect(onrejected).toHaveBeenCalledWith(REASON);
    });

    it('passes the reason from onrejected to onfulfilled', async () => {
      expect.assertions(4);

      // Arrange

      onrejected = vi.fn((reason) => {
        return reason;
      });
      const promise = new MyPromise((_, reject) => {
        reject(REASON);
      });

      // Act
      await promise.then(null, onrejected).then(onfulfilled);

      // Assert
      expect(onrejected).toHaveBeenCalledOnce();
      expect(onrejected).toHaveBeenCalledWith(REASON);

      expect(onfulfilled).toHaveBeenCalledOnce();
      expect(onfulfilled).toHaveBeenCalledWith(REASON);
    });

    it('calls onfulfilled with the resolved value from a chained promise', async () => {
      expect.assertions(2);

      // Arrange
      const promise = new MyPromise((resolve) => {
        resolve(42);
      });

      // Act
      await promise
        .then((value) => {
          return new MyPromise((resolve) => resolve(value + 10));
        })
        .then(onfulfilled);

      // Assert
      expect(onfulfilled).toHaveBeenCalledOnce();
      expect(onfulfilled).toHaveBeenLastCalledWith(52);
    });
  });

  describe('finally', () => {
    it('calls onfulfilled after fulfillment', async () => {
      expect.assertions(1);

      // Arrange
      const promise = new MyPromise((resolve) => {
        resolve(SUCCESS_VALUE);
      });

      // Act
      await promise.finally(onfulfilled);

      // Assert
      expect(onfulfilled).toHaveBeenCalledOnce();
    });

    it('ignores non-function callbacks and continues with resolved value', async () => {
      expect.assertions(2);

      // Arrange
      const promise = new MyPromise((resolve) => {
        resolve(SUCCESS_VALUE);
      });

      // Act
      await promise.finally(null).then(onfulfilled);

      // Assert
      expect(onfulfilled).toHaveBeenCalledOnce();
      expect(onfulfilled).toHaveBeenCalledWith(SUCCESS_VALUE);
    });

    it('calls onrejected after rejection', async () => {
      expect.assertions(1);

      // Arrange
      const promise = new MyPromise((_, reject) => {
        reject(REASON);
      });

      // Act
      await promise.finally(onrejected);

      // Assert
      expect(onrejected).toHaveBeenCalledOnce();
    });

    it('ignores non-function callbacks and continues with rejected reason', async () => {
      expect.assertions(2);

      // Arrange
      const promise = new MyPromise((_, reject) => {
        reject(REASON);
      });

      // Act
      await promise.finally(null).then(onrejected);

      // Assert
      expect(onrejected).toHaveBeenCalledOnce();
      expect(onrejected).toHaveBeenCalledWith(REASON);
    });
  });

  describe('static methods', () => {
    describe('resolve', () => {
      it('returns nested promise', async () => {
        expect.assertions(1);

        // Arrange
        const nestedPromise = new MyPromise((resolve) => {
          resolve(SUCCESS_VALUE);
        });

        // Act
        await expect(MyPromise.resolve(nestedPromise)).toEqual(nestedPromise);
      });

      it('calls onfulfilled when the promise is fulfilled', async () => {
        expect.assertions(3);

        // Act
        await MyPromise.resolve(SUCCESS_VALUE)
          .then(onfulfilled)
          .catch(onrejected);

        // Assert
        expect(onfulfilled).toHaveBeenLastCalledWith(SUCCESS_VALUE);
        expect(onfulfilled).toHaveBeenCalledOnce();

        expect(onrejected).not.toHaveBeenCalled();
      });

      it('calls onrejected with reason when nested promise is rejected', async () => {
        expect.assertions(3);

        // Arrange

        // Act
        await MyPromise.resolve(MyPromise.reject(REASON))
          .then(onfulfilled)
          .catch(onrejected);

        // Assert
        expect(onfulfilled).not.toHaveBeenCalled();

        expect(onrejected).toHaveBeenCalledWith(REASON);
        expect(onrejected).toHaveBeenCalledOnce();
      });
    });

    describe('reject', () => {
      it('calls onrejected when the promise is rejected', async () => {
        expect.assertions(2);

        // Act
        await MyPromise.reject(REASON).catch(onrejected);

        // Assert
        expect(onrejected).toHaveBeenCalledWith(REASON);
        expect(onrejected).toHaveBeenCalledOnce();
      });

      it('rejects with the nested promise', async () => {
        expect.assertions(2);

        // Arrange
        const nestedPromise = new MyPromise((_, reject) => {
          setTimeout(reject, DELAY, REASON);
        });

        // Act
        await MyPromise.reject(nestedPromise).catch(onrejected);

        // Assert
        expect(onrejected).toHaveBeenCalledWith(nestedPromise);
        expect(onrejected).toHaveBeenCalledOnce();
      });
    });

    describe('all', () => {
      it('rejects if the input is number', async () => {
        expect.assertions(1);

        // Arrange
        const expected = 42;
        // @ts-ignore
        const promise = MyPromise.all(expected);

        // Act and Assert
        await expect(promise.then(onfulfilled)).rejects.toThrow(
          TypeError(
            `number ${expected} is not iterable (cannot read property Symbol(Symbol.iterator))`,
          ),
        );
      });

      it('rejects if the input is NaN', async () => {
        expect.assertions(1);

        // Arrange
        const expected = NaN;
        // @ts-ignore
        const promise = MyPromise.all(expected);

        // Act and Assert
        await expect(promise.then(onfulfilled)).rejects.toThrowError(
          TypeError(
            `number ${expected} is not iterable (cannot read property Symbol(Symbol.iterator))`,
          ),
        );
      });

      it('rejects if the input is boolean', async () => {
        expect.assertions(1);

        // Arrange
        const expected = true;
        // @ts-ignore
        const promise = MyPromise.all(expected);

        // Act and Assert
        await expect(promise.then(onfulfilled)).rejects.toThrowError(
          TypeError(
            `boolean ${expected} is not iterable (cannot read property Symbol(Symbol.iterator))`,
          ),
        );
      });

      it('works with an empty array', async () => {
        expect.assertions(2);

        // Arrange
        const expected: [] = [];

        // Act
        await MyPromise.all(expected).then(onfulfilled);

        // Assert
        expect(onfulfilled).toHaveBeenCalledOnce();
        expect(onfulfilled).toHaveBeenCalledWith(expected);
      });

      it('resolves with an array of promises', async () => {
        expect.assertions(2);

        // Assert
        const VALUES = [1, 2, 3];
        const promises = VALUES.map((value) => MyPromise.resolve(value));

        // Act
        await MyPromise.all(promises).then(onfulfilled).catch(onrejected);

        // Assert
        expect(onfulfilled).toHaveBeenCalledOnce();
        expect(onfulfilled).toHaveBeenLastCalledWith(VALUES);
      });

      it('handles non-promise values in the iterable', async () => {
        expect.assertions(2);

        // Arrange
        const VALUES = [1, 2, 3];

        // Act
        await MyPromise.all(VALUES).then(onfulfilled).catch(onrejected);

        expect(onfulfilled).toHaveBeenLastCalledWith(VALUES);
        expect(onrejected).not.toHaveBeenCalled();
      });

      it('rejects if any of the promises rejects', async () => {
        expect.assertions(3);

        // Act
        await MyPromise.all([
          MyPromise.resolve(1),
          MyPromise.reject(REASON),
          MyPromise.resolve(2),
        ])
          .then(onfulfilled)
          .catch(onrejected);

        // Assert
        expect(onfulfilled).not.toHaveBeenCalled();

        expect(onrejected).toHaveBeenCalledOnce();
        expect(onrejected).toHaveBeenCalledWith(REASON);
      });

      it('resolves with delayed promises', async () => {
        expect.assertions(1);

        // Arrange
        const values = [0, 1, 2];
        const promise0 = new MyPromise((resolve) => {
          setTimeout(resolve, 200, values.at(0));
        });

        const promise1 = new MyPromise((resolve) => {
          setTimeout(resolve, 100, values.at(1));
        });

        const promise2 = new MyPromise((resolve) => {
          setTimeout(resolve, 10, values.at(2));
        });

        // Act
        await MyPromise.all([promise0, promise1, promise2]).then(onfulfilled);

        // Assert
        expect(onfulfilled).toHaveBeenCalledWith(values);
      });
    });

    describe('race', () => {
      it('rejects if the input is not iterable', async () => {
        expect.assertions(1);

        // Arrange
        const expected = 42;
        // @ts-ignore

        // Act and Assert
        await expect(MyPromise.race(expected)).rejects.toThrowError(
          TypeError(
            `number ${expected} is not iterable (cannot read property Symbol(Symbol.iterator))`,
          ),
        );
      });

      it('resolves with first fulfilled promise', async () => {
        expect.assertions(1);

        // Arrange
        const promise2 = new MyPromise((resolve) => {
          setTimeout(resolve, DELAY, SUCCESS_VALUE);
        });

        const promise1 = new MyPromise((resolve) => {
          setTimeout(resolve, 100, 'slow');
        });

        const promise = MyPromise.race([promise1, promise2]);

        await expect(promise).resolves.toBe(SUCCESS_VALUE);
      });

      it('rejects with the fastest rejected promise', async () => {
        expect.assertions(1);

        // Arrange
        const FASTEST_REASON = new Error('the fastest');

        const item1 = new MyPromise((_, reject) => {
          setTimeout(reject, 100, new Error('the slowest'));
        });

        const item2 = new MyPromise((_, reject) => {
          setTimeout(reject, 10, FASTEST_REASON);
        });

        const promise = MyPromise.race([item1, item2]);

        // Act
        await expect(promise).rejects.toThrowError(FASTEST_REASON);
      });

      it('handles non-promise values in the iterable', async () => {
        expect.assertions(1);

        // Arrange
        const expected = 'string';
        const delayedPromise = new MyPromise((resolve) => {
          setTimeout(resolve, 100, 'first');
        });

        const promise = MyPromise.race([delayedPromise, expected, 123]);

        // Act and Assert
        await expect(promise).resolves.toBe(expected);
      });
    });

    describe('any', () => {
      it('rejects if the input is not iterable', async () => {
        expect.assertions(1);

        // Arrange
        const expected = 42;
        // @ts-ignore
        const promise = MyPromise.any(expected);

        // Act and Assert
        await expect(promise).rejects.toThrowError(
          TypeError(
            `number ${expected} is not iterable (cannot read property Symbol(Symbol.iterator))`,
          ),
        );
      });

      it('rejects with an empty array', async () => {
        expect.assertions(1);

        const promise = MyPromise.any([]);

        // Act and Assert
        await expect(promise).rejects.toThrowError(
          AggregateError([], 'All promises were rejected'),
        );
      });

      it('rejects with delayed promises', async () => {
        expect.assertions(1);

        // Arrange
        const errors = [new Error('0'), new Error('1'), new Error('2')];
        const promise0 = new MyPromise((_, reject) => {
          setTimeout(reject, 200, errors.at(0));
        });

        const promise1 = new MyPromise((_, reject) => {
          setTimeout(reject, 100, errors.at(1));
        });

        const promise2 = new MyPromise((_, reject) => {
          setTimeout(reject, 10, errors.at(2));
        });

        const promise = MyPromise.any([promise0, promise1, promise2]);

        // Act and Assert
        await expect(promise).rejects.toThrowError(
          AggregateError(errors, 'All promises were rejected'),
        );
      });

      it('resolves with the first resolved promise', async () => {
        expect.assertions(1);

        // Arrange
        const values = ['first', 'second', 'third'];
        const promise0 = new MyPromise((resolve) => {
          setTimeout(resolve, 70, values.at(2));
        });

        const promise1 = new MyPromise((resolve) => {
          setTimeout(resolve, 50, values.at(0));
        });

        const promise2 = new MyPromise((resolve) => {
          setTimeout(resolve, 60, values.at(1));
        });

        const promise = MyPromise.any([promise0, promise1, promise2]);

        // Act and Assert
        await expect(promise).resolves.toEqual(values.at(0));
      });

      it('rejects if all promises were rejected', async () => {
        expect.assertions(1);

        // Arrange
        const errors = [new Error('a'), new Error('b'), new Error('c')];
        const mappedErrors = errors.map((error) => MyPromise.reject(error));
        const promise = MyPromise.any(mappedErrors);

        // Act and Assert
        await expect(promise).rejects.toThrowError(
          AggregateError(errors, 'All promises were rejected'),
        );
      });
    });

    describe('allSettled', async () => {
      it('rejects if the input is not iterable', async () => {
        expect.assertions(1);

        // Arrange
        const expected = 42;
        // @ts-ignore
        const promise = MyPromise.all(expected);

        // Act and Assert
        await expect(promise).rejects.toThrowError(
          TypeError(
            `number ${expected} is not iterable (cannot read property Symbol(Symbol.iterator))`,
          ),
        );
      });

      it('resolves with empty array', async () => {
        expect.assertions(1);

        // Arrange
        const expected: [] = [];

        const promise = MyPromise.allSettled(expected);

        // Act and Assert
        expect(promise).resolves.toEqual(expected);
      });

      it('handles promises resolved promises correctly', async () => {
        expect.assertions(1);

        // Arrange
        const promises = [
          new MyPromise((resolve) => {
            setTimeout(resolve, 50, 'fast');
          }),
          new MyPromise((_, reject) => {
            setTimeout(reject, 100, new Error('slow'));
          }),
        ];

        // Act
        const promise = MyPromise.allSettled(promises);

        // Act and Assert
        await expect(promise).resolves.toEqual([
          { status: PROMISE_STATES.FULFILLED, value: 'fast' },
          { status: PROMISE_STATES.REJECTED, reason: new Error('slow') },
        ]);
      });

      it('handles array with mix of promises and non-promises', async () => {
        expect.assertions(1);

        // Arrange
        const promises = [
          MyPromise.resolve('one'),
          2,
          MyPromise.reject(new Error('error')),
          3,
        ];

        const promise = MyPromise.allSettled(promises);

        // Act and Assert
        expect(promise).resolves.toEqual([
          { status: PROMISE_STATES.FULFILLED, value: 'one' },
          { status: PROMISE_STATES.FULFILLED, value: 2 },
          { status: PROMISE_STATES.REJECTED, reason: new Error('error') },
          { status: PROMISE_STATES.FULFILLED, value: 3 },
        ]);
      });

      it('handles non-promise in the iterable', async () => {
        expect.assertions(1);

        const promise = MyPromise.allSettled([1, 2]);

        await expect(promise).resolves.toEqual([
          { status: PROMISE_STATES.FULFILLED, value: 1 },
          { status: PROMISE_STATES.FULFILLED, value: 2 },
        ]);
      });

      it('handles all promises fulfilled', async () => {
        expect.assertions(1);

        // Arrange
        const promises = [MyPromise.resolve('one'), MyPromise.resolve('two')];
        const promise = MyPromise.allSettled(promises);

        await expect(promise).resolves.toEqual([
          { status: 'fulfilled', value: 'one' },
          { status: 'fulfilled', value: 'two' },
        ]);
      });

      it('handles with all rejected promises', async () => {
        expect.assertions(1);

        // Arrange
        const promises = [
          MyPromise.reject(new Error('error1')),
          MyPromise.reject(new Error('error2')),
        ];

        const promise = MyPromise.allSettled(promises);

        // Act and Assert
        await expect(promise).resolves.toEqual([
          { status: PROMISE_STATES.REJECTED, reason: new Error('error1') },
          { status: PROMISE_STATES.REJECTED, reason: new Error('error2') },
        ]);
      });
    });

    describe('withResolvers', () => {
      it('resolves the promise when resolve is called', async () => {
        // Arrange
        const { promise, resolve } = MyPromise.withResolvers();

        // Act
        resolve(SUCCESS_VALUE);
        await promise.then(onfulfilled).catch(onrejected);

        // Assert
        expect(onfulfilled).toHaveBeenCalledOnce();
        expect(onfulfilled).toHaveBeenCalledWith(SUCCESS_VALUE);

        expect(onrejected).not.toHaveBeenCalled();
      });

      it('rejects the promise when reject is called', async () => {
        // Arrange
        const { promise, reject } = MyPromise.withResolvers();

        // Act
        reject(REASON);
        await promise.then(onfulfilled).catch(onrejected);

        // Assert
        expect(onfulfilled).not.toHaveBeenCalled();

        expect(onrejected).toHaveBeenCalledOnce();
        expect(onrejected).toHaveBeenCalledWith(REASON);
      });
    });
  });

  describe('toStringTag', () => {
    it('returns correct string representation', () => {
      // Assert
      expect(Object.prototype.toString.call(MyPromise.resolve(1))).toBe(
        '[object MyPromise]',
      );
    });
  });
});
