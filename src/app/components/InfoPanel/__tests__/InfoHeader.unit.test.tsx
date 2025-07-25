import React from 'react';
import { render } from '@testing-library/react';
import InfoHeader from '../InfoHeader';
import { describe, it } from 'vitest';

describe('InfoHeader', () => {
  it('renders without crashing', () => {
    render(<InfoHeader>Test Header</InfoHeader>);
  });
}); 