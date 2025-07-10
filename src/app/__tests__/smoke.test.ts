import { describe, it, expect } from 'vitest'

describe('Smoke Test', () => {
  it('should run a basic test', () => {
    expect(1 + 1).toBe(2)
  })

  it('should handle strings', () => {
    expect('Tone Clock').toContain('Clock')
  })
})