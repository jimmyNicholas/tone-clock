import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AudioControls from '../AudioControls';

describe('FrostedGlassOverlay', () => {
  const mockToggle = vi.fn();

  it('renders children without overlay when sound is enabled', () => {
    render(
      <AudioControls isEnabled={true} onToggle={mockToggle}>
        <div>Clock Content</div>
      </AudioControls>
    );
    
    expect(screen.getByText('Clock Content')).toBeInTheDocument();
    expect(screen.queryByText('Sound Disabled')).not.toBeInTheDocument();
  });

  it('renders overlay when sound is disabled', () => {
    render(
      <AudioControls isEnabled={false} onToggle={mockToggle}>
        <div>Clock Content</div>
      </AudioControls>
    );
    
    expect(screen.getByText('Clock Content')).toBeInTheDocument();
    expect(screen.getByText('Sound Disabled')).toBeInTheDocument();
    expect(screen.getByText('Click to enable')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /click to enable sound/i })).toBeInTheDocument();
  });

  it('calls onToggle when overlay is clicked', () => {
    render(
      <AudioControls isEnabled={false} onToggle={mockToggle}>
        <div>Clock Content</div>
      </AudioControls>
    );
    
    const overlay = screen.getByRole('button', { name: /click to enable sound/i });
    overlay.click();
    
    expect(mockToggle).toHaveBeenCalledTimes(1);
  });
}); 