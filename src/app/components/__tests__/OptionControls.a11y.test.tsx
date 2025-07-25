// moved from app/__tests__ to components/__tests__
import * as matchers from 'vitest-axe/matchers';
import { expect, describe, it } from 'vitest';
expect.extend(matchers);

import React from 'react';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import OptionControls from '../OptionControls';

const notes = [
  { id: '1', name: 'C', volume: 0.5, harmonicInterval: 0, timeType: 'hour' as const }
];

describe('OptionControls accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(
      <OptionControls
        notes={notes}
        updateVolume={() => {}}
        updateHarmonicInterval={() => {}}
        updateNoteType={() => {}}
      />
    );
    // @ts-expect-error: Custom matcher from vitest-axe
    expect(await axe(container)).toHaveNoViolations();
  });
}); 