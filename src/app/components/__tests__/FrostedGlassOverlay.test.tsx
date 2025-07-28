import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FrostedGlassOverlay from '../FrostedGlassOverlay';

describe('FrostedGlassOverlay', () => {
  const mockToggle = vi.fn();

  it('renders children without overlay when sound is enabled', () => {
    render(
      <FrostedGlassOverlay isEnabled={true} onToggle={mockToggle}>
        <div>Clock Content</div>
      </FrostedGlassOverlay>
    );
    
    expect(screen.getByText('Clock Content')).toBeInTheDocument();
    expect(screen.queryByText('Sound Disabled')).not.toBeInTheDocument();
  });

  it('renders overlay when sound is disabled', () => {
    render(
      <FrostedGlassOverlay isEnabled={false} onToggle={mockToggle}>
        <div>Clock Content</div>
      </FrostedGlassOverlay>
    );
    
    expect(screen.getByText('Clock Content')).toBeInTheDocument();
    expect(screen.getByText('Sound Disabled')).toBeInTheDocument();
    expect(screen.getByText('Click to enable')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /click to enable sound/i })).toBeInTheDocument();
  });

  it('calls onToggle when overlay is clicked', () => {
    render(
      <FrostedGlassOverlay isEnabled={false} onToggle={mockToggle}>
        <div>Clock Content</div>
      </FrostedGlassOverlay>
    );
    
    const overlay = screen.getByRole('button', { name: /click to enable sound/i });
    overlay.click();
    
    expect(mockToggle).toHaveBeenCalledTimes(1);
  });
}); 