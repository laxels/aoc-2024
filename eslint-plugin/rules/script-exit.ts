import { createRule } from '../util';

export const exitLine = `process.exit(0);`;

export const scriptExit = createRule({
  name: `script-exit`,
  meta: {
    docs: {
      description: `Enforces that scripts exit properly`
    },
    type: `problem`,
    messages: {
      'script-exit': `Scripts must exit properly`
    },
    schema: [],
    fixable: `code`
  },
  defaultOptions: [],
  create: ({ report, sourceCode }) => {
    return {
      Program(node) {
        const lastLine = sourceCode.lines.findLast((l) => l.trim());
        if (lastLine?.trim() === exitLine) {
          return;
        }

        report({
          node,
          messageId: 'script-exit',
          fix: (fixer) => fixer.insertTextAfter(node, `\n\n${exitLine}`)
        });
      }
    };
  }
});
