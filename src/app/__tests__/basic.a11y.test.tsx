import * as matchers from 'vitest-axe/matchers';
import { expect, describe, it } from 'vitest';
expect.extend(matchers);

import React from 'react';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';

describe('Basic accessibility test', () => {
  it('renders a button with no accessibility violations', async () => {
    const { container } = render(<button>Click me</button>);
    // @ts-expect-error: Custom matcher from vitest-axe
    expect(await axe(container)).toHaveNoViolations();
  });
}); 