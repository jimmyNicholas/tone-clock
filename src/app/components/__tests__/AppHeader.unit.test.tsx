import React from 'react';
import { render } from '@testing-library/react';
import AppHeader from '../AppHeader';

describe('AppHeader', () => {
  it('renders without crashing', () => {
    render(<AppHeader />);
  });
}); 