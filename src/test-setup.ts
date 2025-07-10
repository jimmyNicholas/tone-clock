import '@testing-library/jest-dom'
import { vi } from 'vitest'

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