import React from 'react';
import { render } from '@testing-library/react';
import HistoryContent from '../HistoryContent';
import { describe, it } from 'vitest';

describe('HistoryContent', () => {
  it('renders without crashing', () => {
    render(<HistoryContent />);
  });
}); 