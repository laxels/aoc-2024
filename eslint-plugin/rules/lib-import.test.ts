import { RuleTester } from '@typescript-eslint/rule-tester';

import { libImport } from './lib-import';

const ruleTester = new RuleTester();

ruleTester.run(`lib-import`, libImport, {
  valid: [
    // From outside lib/
    {
      name: `Top level 1`,
      filename: `/src/a.ts`,
      code: `import asdf from '$lib';`
    },
    {
      name: `Top level 2`,
      filename: `/src/a.ts`,
      code: `import asdf from '$lib/foo';`
    },
    {
      name: `Not the correct lib directory`,
      filename: `/src/a/b/c.ts`,
      code: `import asdf from '../lib/foo';`
    },
    {
      name: `Unrelated to lib`,
      filename: `/src/a/b/c.ts`,
      code: `import asdf from './d/e';`
    },
    {
      name: `Segment containing lib`,
      filename: `/src/a/b.ts`,
      code: `import asdf from '../lib-util';`
    },

    // From inside lib/
    {
      name: `Relative import of siblings/children in lib`,
      filename: `/src/lib/a/b.ts`,
      code: `import asdf from './c';`
    },
    {
      name: `Nested lib directory`,
      filename: `/src/lib/a.ts`,
      code: `import asdf from './lib/foo';`
    }
  ],

  invalid: [
    // From outside lib/
    {
      name: `Top level 1`,
      filename: `/src/a.ts`,
      code: `import asdf from './lib';`,
      output: `import asdf from '$lib';`,
      errors: [{ messageId: `lib-import` }]
    },
    {
      name: `Top level 2`,
      filename: `/src/a.ts`,
      code: `import asdf from './lib/foo';`,
      output: `import asdf from '$lib/foo';`,
      errors: [{ messageId: `lib-import` }]
    },
    {
      name: `Nested outside lib`,
      filename: `/src/a/b/c.ts`,
      code: `import asdf from '../../lib/foo';`,
      output: `import asdf from '$lib/foo';`,
      errors: [{ messageId: `lib-import` }]
    },

    // From inside lib/
    {
      name: `Inside lib`,
      filename: `/src/lib/a.ts`,
      code: `import asdf from '../lib/foo';`,
      output: `import asdf from '$lib/foo';`,
      errors: [{ messageId: `lib-import` }]
    },
    {
      name: `Nested inside lib`,
      filename: `/src/lib/a/b/c.ts`,
      code: `import asdf from '../../../lib/foo';`,
      output: `import asdf from '$lib/foo';`,
      errors: [{ messageId: `lib-import` }]
    },
    {
      name: `Cross-directory inside lib`,
      filename: `/src/lib/a/b/c.ts`,
      code: `import asdf from '../foo';`,
      output: `import asdf from '$lib/a/foo';`,
      errors: [{ messageId: `lib-import` }]
    }
  ]
});
