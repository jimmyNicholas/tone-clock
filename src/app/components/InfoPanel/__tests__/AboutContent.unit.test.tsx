import React from 'react';
import { render } from '@testing-library/react';
import AboutContent from '../AboutContent';
import { describe, it } from 'vitest';

describe('AboutContent', () => {
  it('renders without crashing', () => {
    render(<AboutContent />);
  });
}); 