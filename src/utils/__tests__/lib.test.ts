import { describe, it, expect } from 'vitest'
import { SCALE_PATTERNS, generateScale, DEFAULT_SCALE } from "../lib"

describe('Music Library', () => {
  it('should generate chromatic scale correctly', () => {
    const chromatic = generateScale(SCALE_PATTERNS.chromatic)
    expect(chromatic).toHaveLength(12)
    expect(chromatic[0]).toBe('C')
    expect(chromatic[1]).toBe('C#')
  })

  it('should generate circle of fifths correctly', () => {
    const fifths = generateScale(SCALE_PATTERNS.circleOfFifths)
    expect(fifths).toHaveLength(12)
    expect(fifths[0]).toBe('C')
    expect(fifths[1]).toBe('G')
  })

  it('should have a valid default scale', () => {
    expect(DEFAULT_SCALE).toBeDefined()
    expect(DEFAULT_SCALE.name).toBeTruthy()
  })
})