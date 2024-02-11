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
  let VALUE: string;
  let REASON: string;
  let NESTED: string;

  // Arrange
  beforeAll(() => {
    VALUE = 'fulfilled';
    REASON = 'rejected';
    NESTED = 'nested';
  });

  describe('executor', () => {
    it('handles executor function', async () => {
      // Arrange
      const value = 'executor';
      const executor = vi.fn((resolve) => resolve(value));

      // Act
      const promise = new CustomPromise<string>(executor);

      // Assert
      await expect(promise).resolves.toEqual(value);
      expect(executor).toHaveBeenCalledOnce();
    });

    it('handles executor function throwing error', async () => {
      // Arrange
      const reason = 'executor error';
      const executor = vi.fn(() => {
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

  describe('resolve', () => {
    it('resolves with value', async () => {
      // Act
      const promise = CustomPromise.resolve(VALUE);

      // Assert
      await expect(promise).resolves.toBe(VALUE);
    });
  });

  describe('reject', () => {
    it('rejects with reason', async () => {
      // Act
      const promise = CustomPromise.reject(REASON);

      // Assert
      await expect(promise).rejects.toThrow(REASON);
    });
  });

  describe('then', () => {
    it('executes onfulfilled handler', async () => {
      // Arrange
      const onFulfilled = vi.fn((result: string) => result.toUpperCase());
      const promise = new CustomPromise<string>((resolve) => {
        resolve(VALUE);
      });

      // Act
      await promise.then(onFulfilled);

      // Assert
      expect(onFulfilled).toHaveBeenCalledWith(VALUE);
      expect(onFulfilled).toHaveBeenCalledOnce();
    });

    it('executes onrejected handler', async () => {
      // Arrange
      const onRejected = vi.fn((error) => error.toUpperCase());
      const promise = new CustomPromise<string>((_, reject) => {
        reject(REASON);
      });

      // Act
      await promise.then(null, onRejected);

      // Assert
      expect(onRejected).toHaveBeenCalledWith(REASON);
      expect(onRejected).toHaveBeenCalledOnce();
    });

    it('chains multiple thens', async () => {
      // Arrange
      const promise = CustomPromise.resolve(VALUE);
      const onFulfilled1 = vi.fn((result: string) => result.toUpperCase());
      const onFulfilled2 = vi.fn((result: string) => result.repeat(2));

      // Act
      await promise.then(onFulfilled1).then(onFulfilled2);

      // Assert
      expect(onFulfilled1).toHaveBeenCalledWith(VALUE);
      expect(onFulfilled1).toHaveBeenCalledOnce();

      expect(onFulfilled2).toHaveBeenCalledWith(VALUE.toUpperCase());
      expect(onFulfilled2).toHaveBeenCalledOnce();
    });

    it('handles nested promises returned from onfulfilled handler', async () => {
      // Arrange

      const onFulfilled = vi.fn(() => CustomPromise.resolve(NESTED));
      const promise = new CustomPromise<string>((resolve) => {
        resolve(VALUE);
      });

      // Act
      await promise.then(onFulfilled).then((result) => {
        // Assert
        expect(onFulfilled).toHaveBeenCalledWith(VALUE);
        expect(onFulfilled).toHaveBeenCalledOnce();
        expect(result).toBe(NESTED);
      });
    });

    it('handles nested promises returned from onrejected handler', async () => {
      // Arrange
      const onRejected = vi.fn(() => CustomPromise.reject(NESTED));
      const promise = new CustomPromise<string>((_, reject) => {
        reject(REASON);
      });

      // Act
      await promise.then(null, onRejected).then(null, (error) => {
        // Assert
        expect(onRejected).toHaveBeenCalledWith(REASON);
        expect(onRejected).toHaveBeenCalledOnce();
        expect(error).toBe(NESTED);
      });
    });
  });

  describe('finally', () => {
    let onFinallyHandler: Mock<any, any>;
    let resolvedPromise: CustomPromise<string>;
    let rejectedPromise: CustomPromise<never>;

    // Arrange
    beforeEach(() => {
      onFinallyHandler = vi.fn();
      resolvedPromise = CustomPromise.resolve(VALUE);
      rejectedPromise = CustomPromise.reject(REASON);
    });

    it('executes the finally handler after fulfillment', async () => {
      // Act
      await resolvedPromise.finally(onFinallyHandler);

      // Assert
      expect(onFinallyHandler).toHaveBeenCalled();
    });

    it('executes the finally handler after rejection', async () => {
      try {
        // Act
        await rejectedPromise.finally(onFinallyHandler);
      } catch (error) {
        /* empty */
      }

      expect(onFinallyHandler).toHaveBeenCalled();
    });
  });
});
