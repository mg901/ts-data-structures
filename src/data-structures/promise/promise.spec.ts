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
  // let onRejectedSpy: Mock<any, any>;

  beforeAll(() => {
    PROMISE_STATE = {
      PENDING: 'pending',
      FULFILLED: 'fulfilled',
      REJECTED: 'rejected',
    } as const;

    FULFILLED_VALUE = 'Hooray';
    REJECTED_REASON = 'Oops';
  });

  beforeEach(() => {
    resolvedPromise = new CustomPromise((resolve) => {
      resolve(FULFILLED_VALUE);
    });

    rejectedPromise = new CustomPromise((_, reject) => {
      reject(new Error(REJECTED_REASON));
    });

    onFulfilledSpy = vi.fn();
    // onRejectedSpy = vi.fn();
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
    it('calls the fulfillment handler with a promise', async () => {
      // Arrange
      const nestedPromise = new CustomPromise((resolve) => resolve(1));

      await new CustomPromise((resolve) => resolve(nestedPromise))
        // Act
        .then(onFulfilledSpy);

      // Assert
      expect(onFulfilledSpy).toHaveBeenCalledWith(nestedPromise);
    });

    // it('handles asynchronous callbacks', async () => {
    //   // Arrange
    //   const promise = new CustomPromise((resolve) => {
    //     resolve(FULFILLED_VALUE);
    //   });

    //   const expected = 'expected';
    //   const asynchronousCallback = () =>
    //     new CustomPromise((resolve) => setTimeout(resolve, 50, expected));

    //   // Act
    //   await promise.then(asynchronousCallback).then(onFulfilledSpy);

    //   // Assert
    //   expect(onFulfilledSpy).toHaveBeenCalledWith(expected);
    //   expect(onFulfilledSpy).toHaveBeenCalledOnce();
    // });

    // it('calls the fulfillment handler with the resolved value', async () => {
    //   // Act
    //   await resolvedPromise.then(onFulfilledSpy);

    //   // Assert
    //   expect(onFulfilledSpy).toHaveBeenCalledWith(FULFILLED_VALUE);
    //   expect(onFulfilledSpy).toHaveBeenCalledOnce();
    // });

    // it('handles exception in the handler', async () => {
    //   // Arrange
    //   const EXPECTED_REASON = 'first';
    //   const promise = new CustomPromise((_, reject) => {
    //     reject(new Error(EXPECTED_REASON));
    //   });

    //   const errorHandler = () => {
    //     throw Error('second');
    //   };

    //   try {
    //     // Act
    //     await promise.then(errorHandler);
    //   } catch (error: unknown) {
    //     if (error instanceof Error) {
    //       // Assert
    //       expect(error.message).toBe(EXPECTED_REASON);
    //     }
    //   }
    // });

    // it('calls the rejection handler if the onfulfilled handler throws an error', async () => {
    //   // Arrange
    //   const promise = new CustomPromise((resolve) => {
    //     resolve('value');
    //   });

    //   const EXPECTED_REASON = 'handler error';
    //   const onRejectedSpy2 = vi.fn();

    //   const errorHandler = () => {
    //     throw new Error(EXPECTED_REASON);
    //   };

    //   try {
    //     await promise
    //       // Act
    //       .then(errorHandler, onRejectedSpy)
    //       .then(null, onRejectedSpy2);
    //   } catch {
    //     // Assert
    //     expect(onRejectedSpy2).toHaveBeenCalledWith(Error(EXPECTED_REASON));
    //     expect(onRejectedSpy2).toHaveBeenCalledOnce();
    //   }
    // });

    // it('call the rejection handler if the promise is rejected', async () => {
    //   // Arrange
    //   const EXPECTED_REASON = 'expected reason';
    //   const promise = new CustomPromise((_, reject) => {
    //     reject(new Error(EXPECTED_REASON));
    //   });

    //   await promise.then(null, onRejectedSpy);

    //   expect(onRejectedSpy).toHaveBeenCalledWith(Error(EXPECTED_REASON));
    //   expect(onRejectedSpy).toHaveBeenCalledOnce();
    // });

    // it('can be used in call chain', async () => {
    //   // Arrange
    //   const value = 1;
    //   const nextValue = value + 1;
    //   const onFulfilled1 = onFulfilledSpy.mockReturnValue(nextValue);
    //   const onFulfilled2 = vi.fn();
    //   const promise = new CustomPromise((resolve) => {
    //     resolve(value);
    //   });

    //   // Act
    //   await promise.then(onFulfilled1).then(onFulfilled2);

    //   // Assert
    //   expect(onFulfilled1).toHaveBeenCalledWith(value);
    //   expect(onFulfilled1).toHaveBeenCalledOnce();

    //   expect(onFulfilled2).toHaveBeenCalledWith(nextValue);
    //   expect(onFulfilled2).toHaveBeenCalledOnce();
    // });
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
    it('resolves with non-promise value', async () => {
      // Arrange
      const NON_PROMISE_VALUE = 'nested value';

      // Act
      const result = await CustomPromise.resolve(NON_PROMISE_VALUE);

      // Assert
      expect(result).toBe(NON_PROMISE_VALUE);
    });

    it('resolve with nested promise ', async () => {
      // Arrange
      const NESTED_VALUE = 'nested value';
      const nestedPromise = new CustomPromise((resolve) => {
        setTimeout(resolve, 50, NESTED_VALUE);
      });

      // Act
      const result = await CustomPromise.resolve(nestedPromise);

      // Assert
      expect(result).toBe(NESTED_VALUE);
    });
  });

  describe('reject', () => {
    it('rejects with non-promise reason', async () => {
      // Arrange
      const NESTED_REASON = 'nested reason';

      try {
        // Act
        await CustomPromise.reject(new Error(NESTED_REASON));
      } catch (error: unknown) {
        if (error instanceof Error) {
          // Assert
          expect(error.message).toBe(NESTED_REASON);
        }
      }
    });

    it('rejects with rested promise reason', async () => {
      // Arrange
      const NESTED_REASON = 'nested reason';
      const nestedPromise = new CustomPromise((resolve) => {
        setTimeout(resolve, 50, new Error(NESTED_REASON));
      });

      try {
        // Act
        await CustomPromise.reject(nestedPromise);
      } catch (error: unknown) {
        if (error instanceof Error) {
          // Assert
          expect(error.message).toBe(NESTED_REASON);
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
