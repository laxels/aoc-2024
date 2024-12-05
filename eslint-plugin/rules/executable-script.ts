import type { AST } from '@typescript-eslint/utils/ts-eslint';

import { createRule } from '../util';

export const shebangLine = `#! /usr/bin/env -S yarn vite-node --options.transformMode.ssr=/.*/`;

export const executableScript = createRule({
  name: `executable-script`,
  meta: {
    docs: {
      description: `Enforces that scripts are executable using \`vite-node\``
    },
    type: `problem`,
    messages: {
      'executable-script': `Scripts must be executable using \`vite-node\``
    },
    schema: [],
    fixable: `code`
  },
  defaultOptions: [],
  create: ({ report, sourceCode }) => {
    return {
      Program(node) {
        const firstLine = sourceCode.lines[0];

        if (firstLine === shebangLine) {
          return;
        }

        const hasShebang = firstLine != null && firstLine.startsWith('#!');

        report({
          node,
          messageId: 'executable-script',
          fix: (fixer) => {
            if (hasShebang) {
              const range: AST.Range = [0, firstLine.length];
              return fixer.replaceTextRange(range, shebangLine);
            }
            return fixer.insertTextBeforeRange([0, 0], `${shebangLine}\n\n`);
          }
        });
      }
    };
  }
});
