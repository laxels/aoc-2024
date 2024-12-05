import { RuleTester } from '@typescript-eslint/rule-tester';

import { exitLine, scriptExit } from './script-exit';

const code = `console.log('hello');`;

const ruleTester = new RuleTester();

ruleTester.run(`script-exit`, scriptExit, {
  valid: [
    {
      name: `Without trailing newline`,
      code: `
${code}

${exitLine}
      `.trim()
    },

    {
      name: `With trailing newline`,
      code: `
${code}

${exitLine}
`
    }
  ],

  invalid: [
    {
      name: `Without trailing newline`,
      code,
      output: `
${code}

${exitLine}
      `.trim(),
      errors: [{ messageId: `script-exit` }]
    },

    {
      name: `With trailing newline`,
      code: `${code}\n`,
      output: `
${code}


${exitLine}
      `.trim(),
      errors: [{ messageId: `script-exit` }]
    },

    {
      name: `Comments at top of file`,
      code: `
// hello

${code}
      `.trim(),
      output: `
// hello

${code}

${exitLine}
      `.trim(),
      errors: [{ messageId: `script-exit` }]
    },

    {
      name: `Comments at bottom of file`,
      code: `
${code}

// hello
      `.trim(),
      output: `
${code}

// hello

${exitLine}
      `.trim(),
      errors: [{ messageId: `script-exit` }]
    }
  ]
});
