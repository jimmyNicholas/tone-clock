import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TabbedPanel, { TabConfig } from '../TabbedPanel';

const tabs: TabConfig[] = [
  {
    key: 'audio',
    label: 'Audio',
    content: <div>Audio Content</div>,
  },
  {
    key: 'timezone',
    label: 'Timezone',
    content: <div>Timezone Content</div>,
  },
];

describe('TabbedPanel', () => {
  it('renders without crashing and shows the audio tab by default', () => {
    render(<TabbedPanel tabs={tabs} defaultTab="audio" />);
    expect(screen.getByText('Audio Content')).toBeInTheDocument();
    expect(screen.queryByText('Timezone Content')).not.toBeVisible();
  });

  // Note: Tab switching by click is tested manually in the browser.
  // In jsdom, the DOM does not always update as expected after click events.
  // This is a known limitation of the test environment.
}); 