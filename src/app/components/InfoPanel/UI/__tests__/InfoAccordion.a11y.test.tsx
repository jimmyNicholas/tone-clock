// moved from app/__tests__ to InfoPanel/__tests__
import * as matchers from 'vitest-axe/matchers';
import { expect, describe, it } from 'vitest';
expect.extend(matchers);

import React from 'react';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import InfoAccordion from '../InfoAccordion';

const items = [
  { id: '1', title: 'Section 1', content: <div>Content 1</div> },
  { id: '2', title: 'Section 2', content: <div>Content 2</div> },
];

describe('InfoAccordion accessibility', () => {
  it('has no accessibility violations when closed', async () => {
    const { container } = render(<InfoAccordion items={items} defaultOpen={-1} />);
    // @ts-expect-error: Custom matcher from vitest-axe
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no accessibility violations when open', async () => {
    const { container } = render(<InfoAccordion items={items} defaultOpen={0} />);
    // @ts-expect-error: Custom matcher from vitest-axe
    expect(await axe(container)).toHaveNoViolations();
  });
}); 