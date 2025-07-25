import React from 'react';
import { render } from '@testing-library/react';
import ClockFace from '../ClockFace';
import { describe, it } from 'vitest';

describe('ClockFace', () => {
  it('renders without crashing', () => {
    render(<ClockFace hours={3} minutes={15} seconds={30} size={200} />);
  });
}); 