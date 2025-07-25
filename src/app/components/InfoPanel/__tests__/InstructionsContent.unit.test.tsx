import React from 'react';
import { render } from '@testing-library/react';
import InstructionsContent from '../InstructionsContent';
import { describe, it } from 'vitest';

describe('InstructionsContent', () => {
  it('renders without crashing', () => {
    render(<InstructionsContent />);
  });
}); 