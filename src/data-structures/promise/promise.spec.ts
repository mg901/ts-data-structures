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
  let RESOLVED_VALUE: string;
  let REJECTED_REASON: string;

  // Arrange
  let resolvedPromise: CustomPromise<string>;
  let rejectedPromise: CustomPromise<never>;
  let onFulfilledSpy: Mock<any, any>;
  let onRejectedSpy: Mock<any, any>;

  beforeEach(() => {
    RESOLVED_VALUE = 'fulfilled';
    REJECTED_REASON = 'rejected';
    resolvedPromise = CustomPromise.resolve(RESOLVED_VALUE);
    rejectedPromise = CustomPromise.reject(REJECTED_REASON);

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

  describe('resolve', () => {
    it('resolves with value', async () => {
      // Act
      const result = await CustomPromise.resolve(RESOLVED_VALUE);

      // Assert
      expect(result).toBe(RESOLVED_VALUE);
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
    it('resolves with the first fulfilled promise', async () => {
      // Arrange
      const FIRST_VALUE = 'promise1';
      const SECOND_VALUE = 'promise2';
      const promise1 = new CustomPromise((resolve) => {
        setTimeout(resolve, 200, FIRST_VALUE);
      });

      const promise2 = new CustomPromise((resolve) => {
        setTimeout(resolve, 100, SECOND_VALUE);
      });

      // Act
      const promise = await CustomPromise.race([promise1, promise2]);

      // Assert
      expect(promise).toBe(SECOND_VALUE);
    });

    it('rejects with the first rejected promise', async () => {
      // Arrange
      const FIRST_VALUE = 'promise1';
      const SECOND_VALUE = 'promise2';

      const promise1 = new CustomPromise((_, reject) => {
        setTimeout(reject, 100, new Error(FIRST_VALUE));
      });

      const promise2 = new CustomPromise((_, reject) => {
        setTimeout(reject, 50, new Error(SECOND_VALUE));
      });

      try {
        // Act
        await CustomPromise.race([promise1, promise2]);
      } catch (error: unknown) {
        if (error instanceof Error) {
          // Assert
          expect(error.message).toMatch(SECOND_VALUE);
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

  describe('then', () => {
    it('handles asynchronous callbacks', async () => {
      // Arrange
      const asynchronousCallback = () =>
        new CustomPromise((resolve) =>
          setTimeout(resolve, 100, RESOLVED_VALUE),
        );

      // Act
      await resolvedPromise.then(asynchronousCallback).then(onFulfilledSpy);

      // Assert
      expect(onFulfilledSpy).toHaveBeenCalledWith(RESOLVED_VALUE);
    });

    it('calls the fulfillment handler with the resolved value', async () => {
      // Act
      await resolvedPromise.then(onFulfilledSpy);

      // Assert
      expect(onFulfilledSpy).toHaveBeenCalledWith(RESOLVED_VALUE);
    });

    it('calls the rejection handler with the rejected reason', async () => {
      // Act
      await rejectedPromise.then(null, onRejectedSpy);

      // Assert
      expect(onRejectedSpy).toHaveBeenCalledWith(REJECTED_REASON);
    });

    it('handles exception in the handler', async () => {
      // Arrange
      const errorHandler = () => {
        throw Error(REJECTED_REASON);
      };

      try {
        // Assert
        await resolvedPromise.then(errorHandler);
      } catch (error: unknown) {
        if (error instanceof Error) {
          // Assert
          expect(error.message).toBe(REJECTED_REASON);
        }
      }
    });

    it('can be used in call chain', async () => {
      // Arrange
      const value = 1;
      const nextValue = value + 1;
      const onFulfilled1 = onFulfilledSpy.mockReturnValue(nextValue);
      const onFulfilled2 = onFulfilledSpy;

      // Act
      await CustomPromise.resolve(value).then(onFulfilled1).then(onFulfilled2);

      // Assert
      expect(onFulfilled1).toHaveBeenCalledWith(value);
      expect(onFulfilled2).toHaveBeenCalledWith(nextValue);
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
});
