import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type Mock,
} from 'vitest';
import { MyPromise } from './index';

const onFulfilledSpy = vi.fn();
const onRejectedSpy = vi.fn();
const PROMISE_STATE = {
  PENDING: 'pending',
  FULFILLED: 'fulfilled',
  REJECTED: 'rejected',
} as const;

const FULFILLED_VALUE = 'Hooray';
const REJECTED_REASON = 'Oops';
const IS_NOT_ITERABLE_ERROR_MESSAGE =
  'is not iterable (cannot read property Symbol(Symbol.iterator))';
describe('MyPromise', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('executor', () => {
    let executorSpy: Mock<any, any>;

    // Arrange
    beforeEach(() => {
      executorSpy = vi.fn();
    });

    it('handles executor function', async () => {
      expect.assertions(2);

      // Arrange
      const expected = 'executor';
      const executor = executorSpy.mockImplementation((resolve) =>
        resolve(expected),
      );

      // Act
      const received = await new MyPromise<string>(executor);

      // Assert
      expect(received).toEqual(expected);
      expect(executor).toHaveBeenCalledOnce();
    });

    it('handles executor function throwing error', async () => {
      expect.assertions(2);

      // Arrange
      const expected = 'executor error';
      const executor = executorSpy.mockImplementation(() => {
        throw new Error(expected);
      });

      try {
        // Act
        await new MyPromise<string>(executor);
      } catch (error: any) {
        // Assert
        expect(error.message).toBe(expected);
      }

      // Assert
      expect(executor).toHaveBeenCalledOnce();
    });
  });

  describe('then', () => {
    it('returns the resolved value by flattening nested promises', async () => {
      expect.assertions(3);

      // Arrange
      const expected = 1;
      const nestedPromise = new MyPromise((resolve) => {
        resolve(expected);
      });

      await new MyPromise((resolve) => {
        resolve(nestedPromise);
      })
        // Act
        .then(onFulfilledSpy, onRejectedSpy);

      // Assert
      expect(onFulfilledSpy).toHaveBeenCalledWith(expected);
      expect(onFulfilledSpy).toHaveBeenCalledOnce();

      expect(onRejectedSpy).not.toHaveBeenCalled();
    });

    it('it returns the resolved value', async () => {
      expect.assertions(3);

      // Arrange
      const promise = new MyPromise((resolve) => {
        resolve(FULFILLED_VALUE);
      });

      // Act
      await promise.then(onFulfilledSpy, onRejectedSpy);

      // Assert
      expect(onFulfilledSpy).toHaveBeenCalledWith(FULFILLED_VALUE);
      expect(onFulfilledSpy).toHaveBeenCalledOnce();

      expect(onRejectedSpy).not.toHaveBeenCalled();
    });

    it('handles asynchronous callbacks passed as fulfillment handler', async () => {
      expect.assertions(3);

      // Arrange
      const expected = 'expected';
      const promise = new MyPromise((resolve) => {
        resolve(FULFILLED_VALUE);
      });

      const asynchronousCallback = () =>
        new MyPromise((resolve) => {
          setTimeout(resolve, 50, expected);
        });

      // Act
      await promise
        .then(asynchronousCallback, onRejectedSpy)
        .then(onFulfilledSpy);

      // Assert
      expect(onRejectedSpy).not.toHaveBeenCalled();

      expect(onFulfilledSpy).toHaveBeenCalledWith(expected);
      expect(onFulfilledSpy).toHaveBeenCalledOnce();
    });

    it('handles an empty fulfillment handler and calls the next handler with the resolved value', async () => {
      expect.assertions(3);

      // Arrange
      const promise = new MyPromise((resolve) => {
        resolve(FULFILLED_VALUE);
      });

      // Act
      await promise.then(null, onRejectedSpy).then(onFulfilledSpy);

      // Assert
      expect(onRejectedSpy).not.toHaveBeenCalled();

      expect(onFulfilledSpy).toHaveBeenCalledWith(FULFILLED_VALUE);
      expect(onFulfilledSpy).toHaveBeenCalledOnce();
    });

    it('handles error thrown in the fulfillment handler of a resolved promise', async () => {
      expect.assertions(3);

      // Arrange
      const expected = new Error('message');
      const promise = new MyPromise((resolve) => {
        resolve(FULFILLED_VALUE);
      });

      const onRejectedSpy1 = vi.fn();
      const onRejectedSpy2 = vi.fn();

      await promise
        // Act
        .then(() => {
          throw expected;
        }, onRejectedSpy1)
        .then(null, onRejectedSpy2);

      // Assert
      expect(onRejectedSpy1).not.toHaveBeenCalled();

      expect(onRejectedSpy2).toHaveBeenCalledWith(expected);
      expect(onRejectedSpy2).toHaveBeenCalledOnce();
    });

    it('handles error thrown in the fulfillment handler of a rejected promise', async () => {
      expect.assertions(3);

      // Arrange
      const expected = new Error('message');
      const promise = new MyPromise((_, reject) => {
        reject(expected);
      });

      const onRejectedSpy1 = vi.fn();
      const onRejectedSpy2 = vi.fn();

      await promise
        // Act
        .then(() => {
          throw expected;
        }, onRejectedSpy1)
        .then(null, onRejectedSpy2);

      // Assert
      expect(onRejectedSpy1).toHaveBeenCalledWith(expected);
      expect(onRejectedSpy1).toHaveBeenCalledOnce();

      expect(onRejectedSpy2).not.toHaveBeenCalled();
    });
  });

  describe('finally', () => {
    it('calls the finally handler after fulfillment', async () => {
      // Arrange
      const promise = new MyPromise((resolve) => {
        resolve(FULFILLED_VALUE);
      });

      // Act
      await promise.then(onFulfilledSpy).finally(onRejectedSpy);

      // Assert
      expect(onFulfilledSpy.mock.invocationCallOrder[0]).toBeLessThan(
        onRejectedSpy.mock.invocationCallOrder[0],
      );
    });

    it('calls the finally handler after rejection', async () => {
      // Arrange
      const promise = new MyPromise((_, reject) => {
        reject(new Error(REJECTED_REASON));
      });

      // Act
      await promise.catch(onFulfilledSpy).finally(onRejectedSpy);

      // Assert
      expect(onFulfilledSpy.mock.invocationCallOrder[0]).toBeLessThan(
        onRejectedSpy.mock.invocationCallOrder[0],
      );
    });

    it('handles empty onfinally method after fulfillment', async () => {
      // Arrange
      const expected = 1;

      // Act
      await MyPromise.resolve(expected).finally(null).then(onFulfilledSpy);

      // Assert
      expect(onFulfilledSpy).toHaveBeenCalledWith(expected);
      expect(onFulfilledSpy).toHaveBeenCalledOnce();
    });

    it('handles empty onfinally method after rejection', async () => {
      // Arrange
      const expected = 1;

      // Act
      await MyPromise.reject(expected).finally(null).then(onFulfilledSpy);

      // Assert
      expect(onFulfilledSpy).toHaveBeenCalledWith(expected);
      expect(onFulfilledSpy).toHaveBeenCalledOnce();
    });
  });

  const makeTypeError = (value: any) =>
    TypeError(`${typeof value} ${IS_NOT_ITERABLE_ERROR_MESSAGE}`);

  describe('static methods', () => {
    describe('resolve', () => {
      it('returns the same instance', async () => {
        // Arrange
        const instance = new MyPromise((resolve) => {
          resolve(1);
        });

        // Act
        await expect(MyPromise.resolve(instance)).toEqual(instance);
      });

      it('returns the resolved value', async () => {
        expect.assertions(3);

        // Arrange
        const expected = 'nested value';

        // Act
        await MyPromise.resolve(expected)
          .then(onFulfilledSpy)
          .catch(onRejectedSpy);

        // Assert
        expect(onFulfilledSpy).toHaveBeenLastCalledWith(expected);
        expect(onFulfilledSpy).toHaveBeenCalledOnce();

        expect(onRejectedSpy).not.toHaveBeenCalled();
      });

      it('triggers rejection handler with the rejected value', async () => {
        expect.assertions(3);

        // Arrange
        const expected = new Error('message');

        // Act
        await MyPromise.resolve(MyPromise.reject(expected))
          .then(onFulfilledSpy)
          .catch(onRejectedSpy);

        // Assert
        expect(onFulfilledSpy).not.toHaveBeenCalled();

        expect(onRejectedSpy).toHaveBeenCalledWith(expected);
        expect(onRejectedSpy).toHaveBeenCalledOnce();
      });
    });

    describe('reject', () => {
      it('rejects with the expected error', async () => {
        expect.assertions(2);

        // Arrange
        const expected = new Error('message');

        // Act
        await MyPromise.reject(expected).catch(onRejectedSpy);

        expect(onRejectedSpy).toHaveBeenCalledWith(expected);
        expect(onRejectedSpy).toHaveBeenCalledOnce();
      });

      it('rejects with the nested promise instance', async () => {
        expect.assertions(2);

        // Arrange
        const expected = 'nested reason';
        const nestedPromise = new MyPromise((_, reject) => {
          setTimeout(reject, 50, Error(expected));
        });

        // Act
        await MyPromise.reject(nestedPromise).catch(onRejectedSpy);

        // Assert
        expect(onRejectedSpy).toHaveBeenCalledWith(nestedPromise);
        expect(onRejectedSpy).toHaveBeenCalledOnce();
      });
    });

    describe('all', () => {
      it('rejects if the input is not iterable', async () => {
        expect.assertions(3);

        // Arrange
        const expected = 42;

        // Act
        // @ts-ignore
        await MyPromise.all(expected).then(onFulfilledSpy).catch(onRejectedSpy);

        // Assert
        expect(onFulfilledSpy).not.toHaveBeenCalled();

        expect(onRejectedSpy).toHaveBeenCalledWith(makeTypeError(expected));
        expect(onRejectedSpy).toHaveBeenCalledOnce();
      });

      let VALUES: number[];

      // Arrange
      beforeAll(() => {
        VALUES = [1, 2, 3];
      });

      it('works with empty array', async () => {
        expect.assertions(3);

        // Arrange
        const expected: [] = [];

        // Act
        await MyPromise.all(expected).then(onFulfilledSpy).catch(onRejectedSpy);

        // Assert
        expect(onFulfilledSpy).toHaveBeenLastCalledWith(expected);
        expect(onFulfilledSpy).toHaveBeenCalledOnce();

        expect(onRejectedSpy).not.toHaveBeenCalled();
      });

      it('resolves an array of promises', async () => {
        expect.assertions(3);

        // Assert
        const promises = VALUES.map((value) => MyPromise.resolve(value));

        // Act
        await MyPromise.all(promises).then(onFulfilledSpy).catch(onRejectedSpy);

        // Assert
        expect(onFulfilledSpy).toHaveBeenLastCalledWith(VALUES);
        expect(onFulfilledSpy).toHaveBeenCalledOnce();

        expect(onRejectedSpy).not.toHaveBeenCalled();
      });

      it('handles non-promise values in the iterable', async () => {
        expect.assertions(2);

        // Act
        await MyPromise.all(VALUES).then(onFulfilledSpy).catch(onRejectedSpy);

        expect(onFulfilledSpy).toHaveBeenLastCalledWith(VALUES);
        expect(onRejectedSpy).not.toHaveBeenCalled();
      });

      it('rejects if any of the promises rejects', async () => {
        expect.assertions(3);

        // Arrange
        const expected = 'error';

        // Act
        await MyPromise.all([
          MyPromise.resolve(1),
          MyPromise.reject(new Error(expected)),
          MyPromise.resolve(2),
        ])
          .then(onFulfilledSpy)
          .catch(onRejectedSpy);

        // Assert
        expect(onFulfilledSpy).not.toHaveBeenCalled();

        expect(onRejectedSpy).toHaveBeenCalledWith(new Error(expected));
        expect(onRejectedSpy).toHaveBeenCalledOnce();
      });

      it('resolves with delayed promises', async () => {
        expect.assertions(3);

        // Arrange
        const values = [0, 1, 2];

        const promise0 = new MyPromise((resolve) => {
          setTimeout(() => {
            resolve(values.at(0));
          }, 200);
        });
        const promise1 = new MyPromise((resolve) => {
          setTimeout(() => {
            resolve(values.at(1));
          }, 100);
        });
        const promise2 = new MyPromise((resolve) => {
          setTimeout(() => {
            resolve(values.at(2));
          }, 10);
        });

        // Act
        await MyPromise.all([promise0, promise1, promise2])
          .then(onFulfilledSpy)
          .catch(onRejectedSpy);

        // Assert
        expect(onFulfilledSpy).toHaveBeenCalledWith(values);
        expect(onFulfilledSpy).toHaveBeenCalledOnce();

        expect(onRejectedSpy).not.toHaveBeenCalled();
      });
    });

    describe('race', () => {
      it('rejects if the input is not iterable', async () => {
        expect.assertions(3);

        // Arrange
        const expected = 42;

        // Act
        // @ts-ignore
        await MyPromise.race(expected)
          .then(onFulfilledSpy)
          .catch(onRejectedSpy);

        // Assert
        expect(onFulfilledSpy).not.toHaveBeenCalled();

        expect(onRejectedSpy).toHaveBeenCalledWith(makeTypeError(expected));
        expect(onRejectedSpy).toHaveBeenCalledOnce();
      });

      it('resolves with the first fulfilled promise', async () => {
        expect.assertions(3);

        // Arrange
        const expected = 'fast';
        const promise2 = new MyPromise((resolve) => {
          setTimeout(resolve, 50, expected);
        });

        const promise1 = new MyPromise((resolve) => {
          setTimeout(resolve, 100, 'slow');
        });

        // Act
        await MyPromise.race([promise1, promise2])
          .then(onFulfilledSpy)
          .catch(onRejectedSpy);

        expect(onFulfilledSpy).toHaveBeenCalledWith(expected);
        expect(onFulfilledSpy).toHaveBeenCalledOnce();

        expect(onRejectedSpy).not.toHaveBeenCalled();
      });

      it('rejects with the first rejected promise', async () => {
        expect.assertions(3);

        // Arrange
        const expected = 'fast';
        const promise2 = new MyPromise((_, reject) => {
          setTimeout(reject, 50, new Error('fast'));
        });

        const promise1 = new MyPromise((_, reject) => {
          setTimeout(reject, 100, new Error(expected));
        });

        // Act
        await MyPromise.race([promise1, promise2])
          .then(onFulfilledSpy)
          .catch(onRejectedSpy);

        // Assert
        expect(onFulfilledSpy).not.toHaveBeenCalled();

        expect(onRejectedSpy).toHaveBeenCalledWith(new Error(expected));
        expect(onRejectedSpy).toHaveBeenCalledOnce();
      });

      it('handles non-promise values in the iterable', async () => {
        expect.assertions(2);

        // Arrange
        const expected = 'non-promise';
        const promise = new MyPromise((resolve) => {
          setTimeout(resolve, 100, 'first');
        });

        // Act
        await MyPromise.race([promise, expected, 123])
          .then(onFulfilledSpy)
          .catch(onFulfilledSpy);

        // Assert
        expect(onFulfilledSpy).toHaveBeenCalledWith(expected);
        expect(onRejectedSpy).not.toHaveBeenCalled();
      });
    });

    describe('any', () => {
      it('rejects if the input is not iterable', async () => {
        expect.assertions(3);

        // Arrange
        const expected = 42;

        // Act
        // @ts-ignore
        await MyPromise.any(expected).then(onFulfilledSpy).catch(onRejectedSpy);

        // Assert
        expect(onFulfilledSpy).not.toHaveBeenCalled();

        expect(onRejectedSpy).toHaveBeenCalledWith(makeTypeError(expected));
        expect(onRejectedSpy).toHaveBeenCalledOnce();
      });

      it('rejects with an empty array of values', async () => {
        expect.assertions(3);

        // Act
        await MyPromise.any([]).then(onFulfilledSpy).catch(onRejectedSpy);

        // Assert
        expect(onFulfilledSpy).not.toHaveBeenCalled();

        expect(onRejectedSpy).toHaveBeenCalledWith(
          AggregateError([], 'All promises were rejected'),
        );

        expect(onRejectedSpy).toHaveBeenCalledOnce();
      });

      it('rejects with delayed promises', async () => {
        expect.assertions(3);

        // Arrange
        const errors = [new Error('0'), new Error('1'), new Error('2')];

        const promise0 = new MyPromise((_, reject) => {
          setTimeout(() => {
            reject(errors.at(0));
          }, 200);
        });
        const promise1 = new MyPromise((_, reject) => {
          setTimeout(() => {
            reject(errors.at(1));
          }, 100);
        });
        const promise2 = new MyPromise((_, reject) => {
          setTimeout(() => {
            reject(errors.at(2));
          }, 10);
        });

        // Act
        await MyPromise.any([promise0, promise1, promise2])
          .then(onFulfilledSpy)
          .catch(onRejectedSpy);

        // Assert
        expect(onFulfilledSpy).not.toHaveBeenCalled();

        expect(onRejectedSpy).toHaveBeenCalledWith(
          AggregateError(errors, 'All promises were rejected'),
        );

        expect(onRejectedSpy).toHaveBeenCalledOnce();
      });

      it('resolves with the first resolved promise', async () => {
        expect.assertions(3);

        // Arrange
        const expected = 'first';
        const promises = [
          new MyPromise((resolve) => {
            setTimeout(resolve, 70, 'third');
          }),
          new MyPromise((resolve) => {
            setTimeout(resolve, 50, expected);
          }),
          new MyPromise((resolve) => {
            setTimeout(resolve, 60, 'second');
          }),
        ];

        // Act
        await MyPromise.any(promises).then(onFulfilledSpy).catch(onRejectedSpy);

        // Assert
        expect(onFulfilledSpy).toHaveBeenCalledWith(expected);
        expect(onFulfilledSpy).toHaveBeenCalledOnce();

        expect(onRejectedSpy).not.toHaveBeenCalled();
      });

      it('rejects if all promises were rejected', async () => {
        expect.assertions(3);

        // Arrange
        const errors = [new Error('a'), new Error('b'), new Error('c')];
        const mappedErrors = errors.map((error) => MyPromise.reject(error));

        // Act
        await MyPromise.any(mappedErrors)
          .then(onFulfilledSpy)
          .catch(onRejectedSpy);

        // Assert
        expect(onFulfilledSpy).not.toHaveBeenCalled();

        expect(onRejectedSpy).toHaveBeenCalledWith(
          AggregateError(errors, 'All promises were rejected'),
        );

        expect(onRejectedSpy).toHaveBeenCalledOnce();
      });
    });

    describe('allSettled', async () => {
      it('rejects if the input is not iterable', async () => {
        expect.assertions(3);

        // Arrange
        const expected = 42;

        // Act
        // @ts-ignore
        await MyPromise.all(expected).then(onFulfilledSpy).catch(onRejectedSpy);

        // Assert
        expect(onFulfilledSpy).not.toHaveBeenCalled();

        expect(onRejectedSpy).toHaveBeenCalledWith(makeTypeError(expected));
        expect(onRejectedSpy).toHaveBeenCalledOnce();
      });

      it('resolves with empty array', async () => {
        expect.assertions(3);

        // Arrange
        const expected: [] = [];
        // Act
        await MyPromise.allSettled(expected)
          .then(onFulfilledSpy)
          .catch(onRejectedSpy);

        // Assert
        expect(onFulfilledSpy).toHaveBeenCalledWith(expected);
        expect(onFulfilledSpy).toHaveBeenCalledOnce();

        expect(onRejectedSpy).not.toHaveBeenCalled();
      });

      it('handles promises with different settle times', async () => {
        expect.assertions(3);

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
        await MyPromise.allSettled(promises)
          .then(onFulfilledSpy)
          .catch(onRejectedSpy);

        // Assert
        expect(onFulfilledSpy).toHaveBeenCalledWith([
          { status: PROMISE_STATE.FULFILLED, value: 'fast' },
          { status: PROMISE_STATE.REJECTED, reason: new Error('slow') },
        ]);
        expect(onFulfilledSpy).toHaveBeenCalledOnce();

        expect(onRejectedSpy).not.toHaveBeenCalled();
      });

      it('handles array with mix of promises and non-promises', async () => {
        expect.assertions(2);

        // Arrange
        const promises = [
          MyPromise.resolve('one'),
          'two',
          MyPromise.reject(new Error('error')),
          'three',
        ];

        // Act
        await MyPromise.allSettled(promises)
          .then(onFulfilledSpy)
          .catch(onRejectedSpy);

        // Assert
        expect(onFulfilledSpy).toHaveBeenLastCalledWith([
          { status: PROMISE_STATE.FULFILLED, value: 'one' },
          { status: PROMISE_STATE.FULFILLED, value: 'two' },
          { status: PROMISE_STATE.REJECTED, reason: new Error('error') },
          { status: PROMISE_STATE.FULFILLED, value: 'three' },
        ]);

        expect(onRejectedSpy).not.toHaveBeenCalled();
      });

      it('handles non-promise in the iterable', async () => {
        expect.assertions(3);

        // Act
        await MyPromise.allSettled([1, 2])
          .then(onFulfilledSpy)
          .catch(onRejectedSpy);

        // Assert
        expect(onFulfilledSpy).toHaveBeenCalledWith([
          { status: PROMISE_STATE.FULFILLED, value: 1 },
          { status: PROMISE_STATE.FULFILLED, value: 2 },
        ]);
        expect(onFulfilledSpy).toHaveBeenCalledOnce();

        expect(onRejectedSpy).not.toHaveBeenCalled();
      });

      it('handles all promises fulfilled', async () => {
        expect.assertions(3);

        // Arrange
        const promises = [MyPromise.resolve('one'), MyPromise.resolve('two')];

        // Act
        await MyPromise.allSettled(promises)
          .then(onFulfilledSpy)
          .catch(onRejectedSpy);

        // Assert
        expect(onFulfilledSpy).toHaveBeenCalledWith([
          { status: 'fulfilled', value: 'one' },
          { status: 'fulfilled', value: 'two' },
        ]);

        expect(onFulfilledSpy).toHaveBeenCalledOnce();
        expect(onRejectedSpy).not.toHaveBeenCalled();
      });

      it('handles all promises rejected', async () => {
        expect.assertions(3);

        // Arrange
        const promises = [
          MyPromise.reject(new Error('error1')),
          MyPromise.reject(new Error('error2')),
        ];

        // Act
        await MyPromise.allSettled(promises)
          .then(onFulfilledSpy)
          .catch(onRejectedSpy);

        // Assert
        expect(onFulfilledSpy).toHaveBeenCalledWith([
          { status: PROMISE_STATE.REJECTED, reason: new Error('error1') },
          { status: PROMISE_STATE.REJECTED, reason: new Error('error2') },
        ]);
        expect(onFulfilledSpy).toHaveBeenCalledOnce();

        expect(onRejectedSpy).not.toHaveBeenCalled();
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
