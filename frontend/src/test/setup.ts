import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// 扩展 Vitest 断言
expect.extend(matchers);

// 每个测试后清理
afterEach(() => {
  cleanup();
  localStorage.clear();
  sessionStorage.clear();
});

// Mock window.matchMedia (Tailwind CSS 需要)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as any;

// Ensure setTimeout and clearTimeout are available globally
if (typeof globalThis.setTimeout === 'undefined') {
  globalThis.setTimeout = setTimeout;
}
if (typeof globalThis.clearTimeout === 'undefined') {
  globalThis.clearTimeout = clearTimeout;
}
