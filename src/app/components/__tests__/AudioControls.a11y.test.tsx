// moved from app/__tests__ to components/__tests__
import * as matchers from 'vitest-axe/matchers';
import { expect, describe, it } from 'vitest';
expect.extend(matchers);

import React from 'react';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import AudioControls from '../AudioControls';

describe('AudioControls accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(
      <AudioControls audioStarted={false} onToggleAudio={() => {}} />
    );
    // @ts-expect-error: Custom matcher from vitest-axe
    expect(await axe(container)).toHaveNoViolations();
  });
}); 