import delay from 'lodash.delay';
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
  let REJECTED_REASON: Error;

  // Arrange
  beforeAll(() => {
    RESOLVED_VALUE = 'fulfilled';
    REJECTED_REASON = new Error('rejected');
  });

  let resolvedPromise: CustomPromise<string>;
  let rejectedPromise: CustomPromise<never>;
  let onFulfilledSpy: Mock<any, any>;
  let onRejectedSpy: Mock<any, any>;

  beforeEach(() => {
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
      const promise = new CustomPromise<string>(executor);

      // Assert
      await expect(promise).resolves.toEqual(value);
      expect(executor).toHaveBeenCalledOnce();
    });

    it('handles executor function throwing error', async () => {
      // Arrange
      const reason = 'executor error';
      const executor = executorSpy.mockImplementation(() => {
        throw new Error(reason);
      });

      // Act
      const promise = new CustomPromise<string>(executor);

      // Assert
      await expect(promise).rejects.toThrow(reason);
      expect(executor).toHaveBeenCalled();
      expect(executor).toHaveBeenCalledOnce();
    });
  });

  describe('static methods', () => {
    describe('resolve', () => {
      it('resolves with value', async () => {
        // Act and Assert

        await expect(CustomPromise.resolve(RESOLVED_VALUE)).resolves.toBe(
          RESOLVED_VALUE,
        );
      });
    });

    describe('reject', () => {
      it('rejects with reason', async () => {
        // Act and Assert
        await expect(CustomPromise.reject(REJECTED_REASON)).rejects.toThrow(
          REJECTED_REASON,
        );
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

      it('resolves with an array of values', async () => {
        // Act
        const result = await CustomPromise.all(VALUES);

        // Assert
        expect(result).toEqual(VALUES);
      });
    });
  });

  describe('methods', () => {
    describe('then', () => {
      it('handles asynchronous callbacks', async () => {
        // Arrange
        const asynchronousCallback = () =>
          new CustomPromise((resolve) =>
            delay(() => resolve(RESOLVED_VALUE), 100),
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
          throw REJECTED_REASON;
        };

        // Act
        const promise = resolvedPromise.then(errorHandler);

        // Assert
        await expect(promise).rejects.toThrow(REJECTED_REASON);
      });

      it('can be used in call chain', async () => {
        // Arrange
        const value = 1;
        const nextValue = value + 1;
        const onFulfilled1 = onFulfilledSpy.mockReturnValue(nextValue);
        const onFulfilled2 = onFulfilledSpy;

        // Act
        await CustomPromise.resolve(value)
          .then(onFulfilled1)
          .then(onFulfilled2);

        // Assert
        expect(onFulfilled1).toHaveBeenCalledWith(value);
        expect(onFulfilled2).toHaveBeenCalledWith(nextValue);
      });
    });

    describe('finally', () => {
      let onFinallyHandlerMock: Mock<any, any>;

      // Arrange
      beforeEach(() => {
        onFinallyHandlerMock = vi.fn();
      });

      it('executes the finally handler after fulfillment', async () => {
        // Act
        await resolvedPromise.finally(onFinallyHandlerMock);

        // Assert
        expect(onFinallyHandlerMock).toHaveBeenCalled();
      });

      it('executes the finally handler after rejection', async () => {
        try {
          // Act
          await rejectedPromise.finally(onFinallyHandlerMock);
        } catch (error) {
          /* empty */
        }

        // Assert
        expect(onFinallyHandlerMock).toHaveBeenCalled();
      });
    });
  });
});
