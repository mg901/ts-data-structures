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
  let IS_NOT_ITERABLE_ERROR_MESSAGE: string;

  // Arrange
  let resolvedPromise: CustomPromise<string>;
  let rejectedPromise: CustomPromise<never>;
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
      const expected = 'executor';
      const executor = executorSpy.mockImplementation((resolve) =>
        resolve(expected),
      );

      // Act
      const received = await new CustomPromise<string>(executor);

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
        await new CustomPromise<string>(executor);
      } catch (error: unknown) {
        if (error instanceof Error) {
          // Assert
          expect(error.message).toBe(expected);
        }
      }

      expect(executor).toHaveBeenCalled();
      expect(executor).toHaveBeenCalledOnce();
    });
  });

  describe('then', () => {
    it('calls the fulfillment handler with a nested promise', async () => {
      // Arrange
      const nestedPromise = new CustomPromise((resolve) => resolve(1));

      await new CustomPromise((resolve) => resolve(nestedPromise))
        // Act
        .then(onFulfilledSpy);

      // Assert
      expect(onFulfilledSpy).toHaveBeenCalledWith(nestedPromise);
      expect(onFulfilledSpy).toHaveBeenCalledOnce();
    });

    it('handles asynchronous callbacks passed as fulfillment handler', async () => {
      // Arrange
      const expected = 'expected';
      const asynchronousCallback = () =>
        new CustomPromise((resolve) => setTimeout(resolve, 50, expected));

      // Act
      await resolvedPromise.then(asynchronousCallback).then(onFulfilledSpy);

      // Assert
      expect(onFulfilledSpy).toHaveBeenCalledWith(expected);
      expect(onFulfilledSpy).toHaveBeenCalledOnce();
    });

    it('calls the fulfillment handler with the resolved value', async () => {
      // Act
      await resolvedPromise.then(onFulfilledSpy);

      // Assert
      expect(onFulfilledSpy).toHaveBeenCalledWith(FULFILLED_VALUE);
      expect(onFulfilledSpy).toHaveBeenCalledOnce();
    });

    it('handles an empty fulfillment handler and calls the next handler with the resolved value', async () => {
      // Act
      await resolvedPromise.then(null).then(onFulfilledSpy);

      // Assert
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
  });

  describe('resolve', () => {
    it('resolves with non-promise value', async () => {
      // Arrange
      const expected = 'nested value';

      // Act
      const received = await CustomPromise.resolve(expected);

      // Assert
      expect(received).toBe(expected);
    });

    it('resolve with nested promise ', async () => {
      // Arrange
      const expected = 'nested value';
      const nestedPromise = new CustomPromise((resolve) => {
        setTimeout(resolve, 50, expected);
      });

      // Act
      const received = await CustomPromise.resolve(nestedPromise);

      // Assert
      expect(received).toBe(expected);
    });
  });

  describe('reject', () => {
    it('calls onFulfillment handler with the rejected value', async () => {
      // Arrange
      const expected = 'nested reason';

      await CustomPromise.reject(new Error(expected)).catch(onRejectedSpy);

      expect(onRejectedSpy).toHaveBeenCalledOnce();
      expect(onRejectedSpy).toHaveBeenCalledWith(Error(expected));
    });

    it('calls onFulfillment handler with the nested promise value', async () => {
      // Arrange
      const expected = 'nested reason';
      const nestedPromise = new CustomPromise((_, reject) => {
        setTimeout(reject, 50, new Error(expected));
      });

      // Act
      await CustomPromise.reject(nestedPromise).catch(onRejectedSpy);

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
      await CustomPromise.all(expected).catch(onRejectedSpy);

      // Assert
      expect(onRejectedSpy).toHaveBeenCalledWith(
        TypeError(typeof expected + IS_NOT_ITERABLE_ERROR_MESSAGE),
      );
      expect(onRejectedSpy).toHaveBeenCalledOnce();
    });

    let VALUES: number[];

    // Arrange
    beforeAll(() => {
      VALUES = [1, 2, 3];
    });

    it('works with empty array', async () => {
      // Arrange
      const expected: any[] = [];

      // Act
      const received = await CustomPromise.all(expected);

      // Assert
      expect(received).toEqual(expected);
    });

    it('resolves an array of promises', async () => {
      // Assert
      const promises = VALUES.map((value) => CustomPromise.resolve(value));

      // Act
      const received = await CustomPromise.all(promises);

      // Assert
      expect(received).toEqual(VALUES);
    });

    it('handles non-promise values in the iterable', async () => {
      // Act
      const received = await CustomPromise.all(VALUES);

      // Assert
      expect(received).toEqual(VALUES);
    });

    it('rejects if any of the promises rejects', async () => {
      // Act
      const expected = 'error';

      await CustomPromise.all([
        CustomPromise.resolve(1),
        CustomPromise.reject(Error(expected)),
        CustomPromise.resolve(2),
      ]).catch(onRejectedSpy);

      expect(onRejectedSpy).toHaveBeenCalledOnce();
      expect(onRejectedSpy).toHaveBeenCalledWith(Error(expected));
    });
  });

  describe('race', () => {
    it('rejects if the input is not iterable', async () => {
      // Arrange
      const expected = 42;

      // Act
      // @ts-ignore
      await CustomPromise.race(expected).catch(onRejectedSpy);

      // Assert
      expect(onRejectedSpy).toHaveBeenCalledWith(
        TypeError(typeof expected + IS_NOT_ITERABLE_ERROR_MESSAGE),
      );
      expect(onRejectedSpy).toHaveBeenCalledOnce();
    });

    it('resolves with the first fulfilled promise', async () => {
      // Arrange

      const promise2 = new CustomPromise((resolve) => {
        setTimeout(resolve, 50, 'fast');
      });

      const promise1 = new CustomPromise((resolve) => {
        setTimeout(resolve, 100, 'slow');
      });

      // Act
      const promise = await CustomPromise.race([promise1, promise2]);

      // Assert
      expect(promise).toBe('fast');
    });

    it('rejects with the first rejected promise', async () => {
      // Arrange
      const expected = 'fast';
      const promise2 = new CustomPromise((_, reject) => {
        setTimeout(reject, 50, new Error('fast'));
      });

      const promise1 = new CustomPromise((_, reject) => {
        setTimeout(reject, 100, new Error(expected));
      });

      // Act
      await CustomPromise.race([promise1, promise2]).catch(onRejectedSpy);

      // Assert
      expect(onRejectedSpy).toHaveBeenCalledWith(Error(expected));
    });

    it('handles non-promise values in the iterable', async () => {
      // Arrange
      const expected = 'non-promise';
      const promise = new CustomPromise((resolve) =>
        setTimeout(resolve, 100, 'first'),
      );

      // Act
      const received = await CustomPromise.race([promise, expected, 123]);

      // Assert
      expect(received).toBe(expected);
    });
  });

  describe('allSettled', async () => {
    it('rejects if the input is not iterable', async () => {
      // Arrange
      const expected = 42;

      // Act
      // @ts-ignore
      await CustomPromise.all(expected).catch(onRejectedSpy);

      // Assert
      expect(onRejectedSpy).toHaveBeenCalledWith(
        TypeError(typeof expected + IS_NOT_ITERABLE_ERROR_MESSAGE),
      );
      expect(onRejectedSpy).toHaveBeenCalledOnce();
    });

    it('resolves with empty array', async () => {
      // Act
      const received = await CustomPromise.allSettled([]);

      // Assert
      expect(received).toEqual([]);
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
      const received = await CustomPromise.allSettled(promises);

      // Assert
      expect(received).toEqual(expected);
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
      const received = await CustomPromise.allSettled(promises);

      // Assert
      expect(received).toEqual(expected);
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
      const received = await CustomPromise.allSettled(promises);

      // Assert
      expect(received).toEqual(expected);
    });

    it('handles non-promise in the iterable', async () => {
      // Act
      const received = await CustomPromise.allSettled([1, 2]);

      // Assert
      expect(received).toEqual([
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
      const received = await CustomPromise.allSettled(promises);

      // Assert
      expect(received).toEqual(expected);
    });

    it('handles all promises rejected', async () => {
      // Arrange
      const promises = [
        CustomPromise.reject(new Error('error1')),
        CustomPromise.reject(new Error('error2')),
      ];

      // Act
      const received = await CustomPromise.allSettled(promises);

      // Assert
      expect(received).toEqual([
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
      const received = await CustomPromise.allSettled(promises);

      // Assert
      expect(received).toEqual(expected);
    });
  });
});
