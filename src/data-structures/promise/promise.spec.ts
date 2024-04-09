import {
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type Mock,
} from 'vitest';
import { MyPromise } from './index';

describe('MyPromise', () => {
  let PROMISE_STATE: Record<
    'PENDING' | 'FULFILLED' | 'REJECTED',
    'pending' | 'fulfilled' | 'rejected'
  >;
  let FULFILLED_VALUE: string;
  let REJECTED_REASON: string;
  let IS_NOT_ITERABLE_ERROR_MESSAGE: string;

  // Arrange
  let resolvedPromise: MyPromise<string>;
  let rejectedPromise: MyPromise<never>;
  let onFulfilledSpy: Mock<any, any>;
  let onRejectedSpy: Mock<any, any>;

  beforeAll(() => {
    PROMISE_STATE = {
      PENDING: 'pending',
      FULFILLED: 'fulfilled',
      REJECTED: 'rejected',
    } as const;

    FULFILLED_VALUE = 'Hooray';
    REJECTED_REASON = 'Oops';
    IS_NOT_ITERABLE_ERROR_MESSAGE =
      ' is not iterable (cannot read property Symbol(Symbol.iterator))';
  });

  beforeEach(() => {
    resolvedPromise = new MyPromise((resolve) => {
      resolve(FULFILLED_VALUE);
    });

    rejectedPromise = new MyPromise((_, reject) => {
      reject(new Error(REJECTED_REASON));
    });

    onFulfilledSpy = vi.fn();
    onRejectedSpy = vi.fn();
  });

  describe('executor', () => {
    let executorSpy: Mock<any, any>;

    // Arrange
    beforeEach(() => {
      executorSpy = vi.fn();
    });

    it('handles executor function', async () => {
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
      // Arrange
      const expected = 'executor error';
      const executor = executorSpy.mockImplementation(() => {
        throw new Error(expected);
      });

      try {
        // Act
        await new MyPromise<string>(executor);
      } catch (error) {
        if (error instanceof Error) {
          // Assert
          expect(error.message).toBe(expected);
        }
      }

      expect(executor).toHaveBeenCalled();
      expect(executor).toHaveBeenCalledOnce();
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

  describe('then', () => {
    it('calls the fulfillment handler with a nested promise', async () => {
      // Arrange
      const nestedPromise = new MyPromise((resolve) => resolve(1));

      await new MyPromise((resolve) => resolve(nestedPromise))
        // Act
        .then(onFulfilledSpy, onRejectedSpy);

      // Assert
      expect(onFulfilledSpy).toHaveBeenCalledWith(nestedPromise);
      expect(onFulfilledSpy).toHaveBeenCalledOnce();

      expect(onRejectedSpy).not.toHaveBeenCalled();
    });

    it('calls the fulfillment handler with the resolved value', async () => {
      // Act
      await resolvedPromise.then(onFulfilledSpy, onRejectedSpy);

      // Assert
      expect(onFulfilledSpy).toHaveBeenCalledWith(FULFILLED_VALUE);
      expect(onFulfilledSpy).toHaveBeenCalledOnce();

      expect(onRejectedSpy).not.toHaveBeenCalled();
    });

    it('handles asynchronous callbacks passed as fulfillment handler', async () => {
      // Arrange
      const expected = 'expected';
      const asynchronousCallback = () =>
        new MyPromise((resolve) => setTimeout(resolve, 50, expected));

      // Act
      await resolvedPromise
        .then(asynchronousCallback, onRejectedSpy)
        .then(onFulfilledSpy);

      // Assert

      expect(onRejectedSpy).not.toHaveBeenCalled();

      expect(onFulfilledSpy).toHaveBeenCalledWith(expected);
      expect(onFulfilledSpy).toHaveBeenCalledOnce();
    });

    it('handles an empty fulfillment handler and calls the next handler with the resolved value', async () => {
      // Act
      await resolvedPromise.then(null, onRejectedSpy).then(onFulfilledSpy);

      // Assert
      expect(onRejectedSpy).not.toHaveBeenCalled();

      expect(onFulfilledSpy).toHaveBeenCalledWith(FULFILLED_VALUE);
      expect(onFulfilledSpy).toHaveBeenCalledOnce();
    });

    it('handles error thrown in the fulfillment handler of a resolved promise', async () => {
      // Arrange
      const expected = 'handle error';
      const onRejectedSpy1 = vi.fn();
      const onRejectedSpy2 = vi.fn();

      await resolvedPromise
        // Act
        .then(() => {
          throw Error(expected);
        }, onRejectedSpy1)
        .then(null, onRejectedSpy2);

      // Assert
      expect(onRejectedSpy1).not.toHaveBeenCalled();

      expect(onRejectedSpy2).toHaveBeenCalledWith(Error(expected));
      expect(onRejectedSpy2).toHaveBeenCalledOnce();
    });

    it('handles error thrown in the fulfillment handler of a rejected promise', async () => {
      // Arrange
      const expected = 'handle error';
      const onRejectedSpy1 = vi.fn();
      const onRejectedSpy2 = vi.fn();

      await rejectedPromise
        // Act
        .then(() => {
          throw Error(expected);
        }, onRejectedSpy1)
        .then(null, onRejectedSpy2);

      // Assert
      expect(onRejectedSpy1).toHaveBeenCalledWith(Error(REJECTED_REASON));
      expect(onRejectedSpy1).toHaveBeenCalledOnce();

      expect(onRejectedSpy2).not.toHaveBeenCalled();
    });
  });

  describe('finally', () => {
    let onFinallySpy: Mock<any, any>;

    // Arrange
    beforeEach(() => {
      onFinallySpy = vi.fn();
    });

    it('calls the finally handler after fulfillment', async () => {
      // Act
      await resolvedPromise.finally(onFinallySpy);

      // Assert
      expect(onFinallySpy).toHaveBeenCalled();
      expect(onFinallySpy).toHaveBeenCalledOnce();
    });

    it('calls the finally handler after rejection', async () => {
      // Act
      await rejectedPromise.finally(onFinallySpy);

      // Assert
      expect(onFinallySpy).toHaveBeenCalled();
      expect(onFinallySpy).toHaveBeenCalledOnce();
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

  describe('static methods', () => {
    let makeTypeError: (value: any) => TypeError;
    // Arrange
    beforeEach(() => {
      makeTypeError = (value: any) =>
        TypeError(typeof value + IS_NOT_ITERABLE_ERROR_MESSAGE);
    });

    describe('resolve', () => {
      it('resolves with non-promise value', async () => {
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

      it('calls onFulfillment handler with the rejected value', async () => {
        const expected = 'reason';

        await MyPromise.resolve(MyPromise.reject(Error(expected)))
          .then(onFulfilledSpy)
          .catch(onRejectedSpy);

        // Assert
        expect(onFulfilledSpy).not.toHaveBeenCalled();

        expect(onRejectedSpy).toHaveBeenCalledWith(Error(expected));
        expect(onRejectedSpy).toHaveBeenCalledOnce();
      });

      it('resolve with nested promise ', async () => {
        // Arrange
        const expected = 'nested value';
        const nestedPromise = new MyPromise((resolve) => {
          setTimeout(resolve, 50, expected);
        });

        // Act
        await MyPromise.resolve(nestedPromise)
          .then(onFulfilledSpy)
          .catch(onRejectedSpy);

        // Assert
        expect(onFulfilledSpy).toHaveBeenLastCalledWith(expected);
        expect(onFulfilledSpy).toHaveBeenCalledOnce();

        expect(onRejectedSpy).not.toHaveBeenCalled();
      });
    });

    describe('reject', () => {
      it('calls onFulfillment handler with the rejected value', async () => {
        // Arrange
        const expected = 'nested reason';

        await MyPromise.reject(new Error(expected)).catch(onRejectedSpy);

        expect(onRejectedSpy).toHaveBeenCalledWith(Error(expected));
        expect(onRejectedSpy).toHaveBeenCalledOnce();
      });

      it('calls onFulfillment handler with the nested promise value', async () => {
        // Arrange
        const expected = 'nested reason';
        const nestedPromise = new MyPromise((_, reject) => {
          setTimeout(reject, 50, new Error(expected));
        });

        // Act
        await MyPromise.reject(nestedPromise).catch(onRejectedSpy);

        // Assert
        expect(onRejectedSpy).toHaveBeenCalledWith(Error(expected));
        expect(onRejectedSpy).toHaveBeenCalledOnce();
      });
    });

    describe('all', () => {
      it('rejects if the input is not iterable', async () => {
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
        // Act
        await MyPromise.all(VALUES).then(onFulfilledSpy).catch(onRejectedSpy);

        expect(onFulfilledSpy).toHaveBeenLastCalledWith(VALUES);
        expect(onRejectedSpy).not.toHaveBeenCalled();
      });

      it('rejects if any of the promises rejects', async () => {
        // Arrange
        const expected = 'error';

        // Act
        await MyPromise.all([
          MyPromise.resolve(1),
          MyPromise.reject(Error(expected)),
          MyPromise.resolve(2),
        ])
          .then(onFulfilledSpy)
          .catch(onRejectedSpy);

        // Assert
        expect(onFulfilledSpy).not.toHaveBeenCalled();

        expect(onRejectedSpy).toHaveBeenCalledWith(Error(expected));
        expect(onRejectedSpy).toHaveBeenCalledOnce();
      });
    });

    describe('race', () => {
      it('rejects if the input is not iterable', async () => {
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

        expect(onRejectedSpy).toHaveBeenCalledWith(Error(expected));
        expect(onRejectedSpy).toHaveBeenCalledOnce();
      });

      it('handles non-promise values in the iterable', async () => {
        // Arrange
        const expected = 'non-promise';
        const promise = new MyPromise((resolve) =>
          setTimeout(resolve, 100, 'first'),
        );

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

      it('resolves with the first resolved promise', async () => {
        // Arrange
        const expected = 'first';

        // Act
        await MyPromise.any([
          new MyPromise((resolve) => setTimeout(resolve, 70, 'third')),
          new MyPromise((resolve) => setTimeout(resolve, 50, expected)),
          new MyPromise((resolve) => setTimeout(resolve, 60, 'second')),
        ])
          .then(onFulfilledSpy)
          .catch(onRejectedSpy);

        // Assert
        expect(onFulfilledSpy).toHaveBeenCalledWith(expected);
        expect(onFulfilledSpy).toHaveBeenCalledOnce();

        expect(onRejectedSpy).not.toHaveBeenCalled();
      });

      it('rejects if all promises were rejected', async () => {
        // Act
        await MyPromise.any([
          MyPromise.reject(1),
          MyPromise.reject(2),
          MyPromise.reject(3),
        ])
          .then(onFulfilledSpy)
          .catch(onRejectedSpy);

        // Assert
        expect(onFulfilledSpy).not.toHaveBeenCalled();

        expect(onRejectedSpy).toHaveBeenCalledWith(
          AggregateError('All promises were rejected'),
        );
        expect(onRejectedSpy).toHaveBeenCalledOnce();
      });
    });

    describe('allSettled', async () => {
      it('rejects if the input is not iterable', async () => {
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
});
