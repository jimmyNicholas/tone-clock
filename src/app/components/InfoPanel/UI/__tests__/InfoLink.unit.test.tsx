import React from 'react';
import { render } from '@testing-library/react';
import InfoLink from '../InfoLink';
import { describe, it } from 'vitest';

describe('InfoLink', () => {
  it('renders without crashing', () => {
    render(<InfoLink href="#">Test Link</InfoLink>);
  });
}); 