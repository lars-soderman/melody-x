import '@testing-library/jest-dom';

// Mock crypto.randomUUID
let uuidCounter = 0;
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: () => `test-uuid-${uuidCounter++}`,
  },
});

// Mock Date to a fixed time
jest.useFakeTimers();
jest.setSystemTime(new Date('2024-03-20T12:00:00Z'));
