import 'vitest-axe/extend-expect';
import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock next/navigation for Next.js router context in tests
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
  }),
  useSearchParams: () => new URLSearchParams(''),
}));

// Mock canvas getContext for axe-core color contrast checks
Object.defineProperty(window.HTMLCanvasElement.prototype, 'getContext', {
  value: () => null,
});

// Mock Tone.js for testing
vi.mock('tone', () => ({
  Oscillator: vi.fn().mockImplementation(() => ({
    connect: vi.fn().mockReturnThis(),
    start: vi.fn(),
    stop: vi.fn(),
    dispose: vi.fn(),
    frequency: { rampTo: vi.fn() },
    state: 'stopped',
  })),
  Gain: vi.fn().mockImplementation(() => ({
    toDestination: vi.fn().mockReturnThis(),
    dispose: vi.fn(),
    gain: { rampTo: vi.fn() },
  })),
  getContext: vi.fn(() => ({ state: 'suspended' })),
  start: vi.fn().mockResolvedValue(undefined),
}))

// Mock Web Audio API
Object.defineProperty(window, 'AudioContext', {
  writable: true,
  value: vi.fn().mockImplementation(() => ({
    createOscillator: vi.fn(),
    createGain: vi.fn(),
    destination: {},
  })),
})