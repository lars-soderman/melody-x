import '@testing-library/jest-dom';

Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: () => 'test-uuid-123',
  },
});

// Mock Date to a fixed time
jest.useFakeTimers();
jest.setSystemTime(new Date('2024-03-20T12:00:00Z'));
