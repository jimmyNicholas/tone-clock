import * as matchers from 'vitest-axe/matchers';
import { expect, describe, it } from 'vitest';
expect.extend(matchers);

import React from 'react';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import Clock from '../Clock';

describe('App accessibility', () => {
  it('main Clock page has no accessibility violations', async () => {
    const { container } = render(<Clock />);
    // @ts-expect-error: Custom matcher from vitest-axe
    expect(await axe(container)).toHaveNoViolations();
  });
}); 