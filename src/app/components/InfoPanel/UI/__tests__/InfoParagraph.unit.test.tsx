import React from 'react';
import { render } from '@testing-library/react';
import InfoParagraph from '../InfoParagraph';
import { describe, it } from 'vitest';

describe('InfoParagraph', () => {
  it('renders without crashing', () => {
    render(<InfoParagraph>Test paragraph</InfoParagraph>);
  });
}); 