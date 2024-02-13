import {
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type Mock,
} from 'vitest';
import { CustomPromise } from './index';

describe('CustomPromise', () => {
  let PROMISE_STATE: Record<
    'PENDING' | 'FULFILLED' | 'REJECTED',
    'pending' | 'fulfilled' | 'rejected'
  >;
  let FULFILLED_VALUE: string;
  let REJECTED_REASON: string;

  // Arrange
  let resolvedPromise: CustomPromise<string>;
  let rejectedPromise: CustomPromise<never>;
  let onFulfilledSpy: Mock<any, any>;
  let onRejectedSpy: Mock<any, any>;

  beforeEach(() => {
    PROMISE_STATE = {
      PENDING: 'pending',
      FULFILLED: 'fulfilled',
      REJECTED: 'rejected',
    } as const;

    FULFILLED_VALUE = 'Hooray';
    REJECTED_REASON = 'Oops';
    resolvedPromise = new CustomPromise((resolve) => {
      resolve(FULFILLED_VALUE);
    });

    rejectedPromise = new CustomPromise((_, reject) => {
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
      const value = 'executor';
      const executor = executorSpy.mockImplementation((resolve) =>
        resolve(value),
      );

      // Act
      const result = await new CustomPromise<string>(executor);

      // Assert
      expect(result).toEqual(value);
      expect(executor).toHaveBeenCalledOnce();
    });

    it('handles executor function throwing error', async () => {
      // Arrange
      const reason = 'executor error';
      const executor = executorSpy.mockImplementation(() => {
        throw new Error(reason);
      });

      try {
        // Act
        await new CustomPromise<string>(executor);
      } catch (error: unknown) {
        if (error instanceof Error) {
          // Assert
          expect(error.message).toBe(reason);
        }
      }

      expect(executor).toHaveBeenCalled();
      expect(executor).toHaveBeenCalledOnce();
    });
  });

  describe('then', () => {
    it('handles asynchronous callbacks', async () => {
      // Arrange
      const promise = new CustomPromise((resolve) => {
        resolve(FULFILLED_VALUE);
      });

      const expected = 'expected';
      const asynchronousCallback = () =>
        new CustomPromise((resolve) => setTimeout(resolve, 50, expected));

      // Act
      await promise.then(asynchronousCallback).then(onFulfilledSpy);

      // Assert
      expect(onFulfilledSpy).toHaveBeenCalledWith(expected);
    });

    it('calls the fulfillment handler with the resolved value', async () => {
      // Arrange
      const promise = new CustomPromise((resolve) => {
        resolve(FULFILLED_VALUE);
      });

      // Act
      await promise.then(onFulfilledSpy);

      // Assert
      expect(onFulfilledSpy).toHaveBeenCalledWith(FULFILLED_VALUE);
    });

    it('calls the rejection handler with the rejected reason', async () => {
      // Arrange
      const promise = new CustomPromise((_, reject) => {
        reject(new Error(REJECTED_REASON));
      });

      // Act
      await promise.then(null, onRejectedSpy);

      // Assert
      expect(onRejectedSpy).toHaveBeenCalledWith(new Error(REJECTED_REASON));
    });

    it('handles exception in the handler', async () => {
      // Arrange
      const promise = new CustomPromise((_, reject) => {
        reject(new Error('first'));
      });

      const errorHandler = () => {
        throw Error('second');
      };

      try {
        // Act
        await promise.then(errorHandler);
      } catch (error: unknown) {
        if (error instanceof Error) {
          // Assert
          expect(error.message).toBe('first');
        }
      }
    });

    it('can be used in call chain', async () => {
      // Arrange
      const value = 1;
      const nextValue = value + 1;
      const onFulfilled1 = onFulfilledSpy.mockReturnValue(nextValue);
      const onFulfilled2 = vi.fn();
      const promise = new CustomPromise((resolve) => {
        resolve(value);
      });

      // Act
      await promise.then(onFulfilled1).then(onFulfilled2);

      // Assert
      expect(onFulfilled1).toHaveBeenCalledWith(value);
      expect(onFulfilled1).toHaveBeenCalledOnce();

      expect(onFulfilled2).toHaveBeenCalledWith(nextValue);
      expect(onFulfilled2).toHaveBeenCalledOnce();
    });
  });

  describe('finally', () => {
    let onFinallySpy: Mock<any, any>;

    // Arrange
    beforeEach(() => {
      onFinallySpy = vi.fn();
    });

    it('executes the finally handler after fulfillment', async () => {
      // Act
      await resolvedPromise.finally(onFinallySpy);

      // Assert
      expect(onFinallySpy).toHaveBeenCalled();
    });

    it('executes the finally handler after rejection', async () => {
      await rejectedPromise.finally(onFinallySpy);

      // Assert
      expect(onFinallySpy).toHaveBeenCalled();
    });
  });

  describe('resolve', () => {
    it('resolves with value', async () => {
      // Act
      const result = await CustomPromise.resolve(FULFILLED_VALUE);

      // Assert
      expect(result).toBe(FULFILLED_VALUE);
    });
  });

  describe('reject', () => {
    it('rejects with reason', async () => {
      try {
        // Act
        await CustomPromise.reject(new Error(REJECTED_REASON));
      } catch (error: unknown) {
        if (error instanceof Error) {
          // Assert
          expect(error.message).toBe(REJECTED_REASON);
        }
      }
    });
  });

  describe('all', () => {
    it('rejects if the input is not iterable', async () => {
      try {
        // @ts-ignore
        await CustomPromise.all(42);
      } catch (error: unknown) {
        if (error instanceof TypeError) {
          expect(error.message).toBe(
            'number is not iterable (cannot read property Symbol(Symbol.iterator))',
          );
        }
      }
    });

    let VALUES: number[];

    // Arrange
    beforeAll(() => {
      VALUES = [1, 2, 3];
    });

    it('works with empty array', async () => {
      // Arrange
      const EMPTY_ARRAY: any[] = [];

      // Act
      const result = await CustomPromise.all(EMPTY_ARRAY);

      // Assert
      expect(result).toEqual(EMPTY_ARRAY);
    });

    it('resolves an array of promises', async () => {
      // Assert
      const promises = VALUES.map((value) => CustomPromise.resolve(value));

      // Act
      const result = await CustomPromise.all(promises);

      // Assert
      expect(result).toEqual(VALUES);
    });

    it('handles non-promise values in the iterable', async () => {
      // Act
      const result = await CustomPromise.all(VALUES);

      // Assert
      expect(result).toEqual(VALUES);
    });
  });

  describe('race', () => {
    it('rejects if the input is not iterable', async () => {
      try {
        // @ts-ignore
        await CustomPromise.all(42);
      } catch (error: unknown) {
        if (error instanceof TypeError) {
          expect(error.message).toBe(
            'number is not iterable (cannot read property Symbol(Symbol.iterator))',
          );
        }
      }
    });

    it('resolves with the first fulfilled promise', async () => {
      // Arrange

      const promise1 = new CustomPromise((resolve) => {
        setTimeout(resolve, 100, 'slow');
      });

      const promise2 = new CustomPromise((resolve) => {
        setTimeout(resolve, 50, 'fast');
      });

      // Act
      const promise = await CustomPromise.race([promise1, promise2]);

      // Assert
      expect(promise).toBe('fast');
    });

    it('rejects with the first rejected promise', async () => {
      // Arrange
      const promise1 = new CustomPromise((_, reject) => {
        setTimeout(reject, 100, new Error('slow'));
      });

      const promise2 = new CustomPromise((_, reject) => {
        setTimeout(reject, 50, new Error('fast'));
      });

      try {
        // Act
        await CustomPromise.race([promise1, promise2]);
      } catch (error: unknown) {
        if (error instanceof Error) {
          // Assert
          expect(error.message).toBe('fast');
        }
      }
    });

    it('handles non-promise values in the iterable', async () => {
      // Arrange
      const expected = 'non-promise';
      const promise = new CustomPromise((resolve) =>
        setTimeout(resolve, 100, 'first'),
      );

      // Act
      const result = await CustomPromise.race([promise, expected, 123]);

      // Assert
      expect(result).toBe(expected);
    });
  });

  describe('allSettled', async () => {
    it('rejects if the input is not iterable', async () => {
      try {
        // Act
        // @ts-ignore
        await CustomPromise.all(42);
      } catch (error: unknown) {
        if (error instanceof TypeError) {
          // Assert
          expect(error.message).toBe(
            'number is not iterable (cannot read property Symbol(Symbol.iterator))',
          );
        }
      }
    });

    it('resolves with empty array', async () => {
      // Act
      const result = await CustomPromise.allSettled([]);

      // Assert
      expect(result).toEqual([]);
    });

    it('handles promises with different settle times', async () => {
      // Arrange
      const promises = [
        new CustomPromise((resolve) => {
          setTimeout(resolve, 50, 'fast');
        }),
        new CustomPromise((_, reject) => {
          setTimeout(reject, 100, new Error('slow'));
        }),
      ];

      const expected = [
        { status: PROMISE_STATE.FULFILLED, value: 'fast' },
        { status: PROMISE_STATE.REJECTED, reason: new Error('slow') },
      ];

      // Act
      const result = await CustomPromise.allSettled(promises);

      // Assert
      expect(result).toEqual(expected);
    });

    it('handles array with single promise', async () => {
      // Arrange
      const promises = [CustomPromise.resolve('single')];
      const expected = [
        {
          status: PROMISE_STATE.FULFILLED,
          value: 'single',
        },
      ];

      // Act
      const result = await CustomPromise.allSettled(promises);

      // Assert
      expect(result).toEqual(expected);
    });

    it('handles array with mix of promises and non-promises', async () => {
      // Arrange
      const promises = [
        CustomPromise.resolve('one'),
        'two',
        CustomPromise.reject(new Error('error')),
        'three',
      ];

      const expected = [
        { status: PROMISE_STATE.FULFILLED, value: 'one' },
        { status: PROMISE_STATE.FULFILLED, value: 'two' },
        { status: PROMISE_STATE.REJECTED, reason: new Error('error') },
        { status: PROMISE_STATE.FULFILLED, value: 'three' },
      ];

      // Act
      const result = await CustomPromise.allSettled(promises);

      // Assert
      expect(result).toEqual(expected);
    });

    it('handles non-promise in the iterable', async () => {
      // Act
      const result = await CustomPromise.allSettled([1, 2]);

      // Assert
      expect(result).toEqual([
        { status: PROMISE_STATE.FULFILLED, value: 1 },
        { status: PROMISE_STATE.FULFILLED, value: 2 },
      ]);
    });

    it('handles all promises fulfilled', async () => {
      // Arrange
      const promises = [
        CustomPromise.resolve('one'),
        CustomPromise.resolve('two'),
      ];

      const expected = [
        { status: 'fulfilled', value: 'one' },
        { status: 'fulfilled', value: 'two' },
      ];

      // Act
      const result = await CustomPromise.allSettled(promises);

      // Assert
      expect(result).toEqual(expected);
    });

    it('handles all promises rejected', async () => {
      // Arrange
      const promises = [
        CustomPromise.reject(new Error('error1')),
        CustomPromise.reject(new Error('error2')),
      ];

      // Act
      const result = await CustomPromise.allSettled(promises);
      expect(result).toEqual([
        { status: PROMISE_STATE.REJECTED, reason: new Error('error1') },
        { status: PROMISE_STATE.REJECTED, reason: new Error('error2') },
      ]);
    });

    it('handles promise throwing error during execution', async () => {
      // Arrange
      const promises = [
        CustomPromise.reject(new Error('Error during execution')),
        CustomPromise.resolve('resolved'),
      ];

      const expected = [
        {
          status: PROMISE_STATE.REJECTED,
          reason: new Error('Error during execution'),
        },
        {
          status: PROMISE_STATE.FULFILLED,
          value: 'resolved',
        },
      ];

      // Act
      const result = await CustomPromise.allSettled(promises);

      // Assert
      expect(result).toEqual(expected);
    });
  });
});
