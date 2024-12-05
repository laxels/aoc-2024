import { RuleTester } from '@typescript-eslint/rule-tester';

import { executableScript, shebangLine } from './executable-script';

const code = `console.log('hello');`;

const ruleTester = new RuleTester();

ruleTester.run(`executable-script`, executableScript, {
  valid: [
    {
      code: `
${shebangLine}

${code}
      `.trim()
    }
  ],

  invalid: [
    {
      name: `Without existing shebang`,
      code,
      output: `
${shebangLine}

${code}
      `.trim(),
      errors: [{ messageId: `executable-script` }]
    },

    {
      name: `With existing shebang`,
      code: `
#! /usr/bin/env bash

${code}
      `.trim(),
      output: `
${shebangLine}

${code}
      `.trim(),
      errors: [{ messageId: `executable-script` }]
    },

    {
      name: `Comments at top of file`,
      code: `
// hello

${code}
      `.trim(),
      output: `
${shebangLine}

// hello

${code}
      `.trim(),
      errors: [{ messageId: `executable-script` }]
    },

    {
      name: `Comments at bottom of file`,
      code: `
${code}

// hello
      `.trim(),
      output: `
${shebangLine}

${code}

// hello
      `.trim(),
      errors: [{ messageId: `executable-script` }]
    }
  ]
});
