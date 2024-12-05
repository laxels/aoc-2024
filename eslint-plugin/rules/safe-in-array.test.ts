import { RuleTester } from '@typescript-eslint/rule-tester';

import { importStatement, safeFnName, safeInArray, unsafeFnName } from './safe-in-array';

const ruleTester = new RuleTester();

ruleTester.run(`safe-in-array`, safeInArray, {
  valid: [
    {
      code: getInvocation(safeFnName)
    }
  ],

  invalid: [
    {
      name: `No existing import`,
      code: `
${getInvocation(unsafeFnName)}
      `.trim(),
      output: `
${importStatement}
${getInvocation(safeFnName)}
      `.trim(),
      errors: [{ messageId: `safe-in-array` }]
    },

    {
      name: `Existing import`,
      code: `
${importStatement}
${getInvocation(unsafeFnName)}
      `.trim(),
      output: `
${importStatement}
${getInvocation(safeFnName)}
      `.trim(),
      errors: [{ messageId: `safe-in-array` }]
    }
  ]
});

function getInvocation(fnName: string): string {
  return `${fnName}(cellAutofill.status, ['pending', 'ongoing'])`;
}
