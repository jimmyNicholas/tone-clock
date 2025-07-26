import * as matchers from 'vitest-axe/matchers';
import { expect, describe, it } from 'vitest';
expect.extend(matchers);

import React from 'react';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import Home from '../page';

describe('Page accessibility', () => {
  it('main page has no accessibility violations', async () => {
    const { container } = render(<Home />);
    // @ts-expect-error: Custom matcher from vitest-axe
    expect(await axe(container)).toHaveNoViolations();
  });
}); 