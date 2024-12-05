import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import { createRule } from '../util';

export const unsafeFnName = `inArray`;
export const safeFnName = `safeInArray`;
export const importPath = `$lib/server/db/util`;
export const importStatement = `import { ${safeFnName} } from '${importPath}';`;

export const safeInArray = createRule({
  name: `safe-in-array`,
  meta: {
    docs: {
      description: `Enforces usage of \`${safeFnName}\` Drizzle helper`
    },
    type: `problem`,
    messages: {
      'safe-in-array': `Use \`${safeFnName}\` helper instead of \`${unsafeFnName}\``
    },
    schema: [],
    fixable: `code`
  },
  defaultOptions: [],
  create: ({ report, sourceCode }) => {
    return {
      CallExpression(node): void {
        if (node.callee.type !== AST_NODE_TYPES.Identifier) {
          return;
        }

        if (node.callee.name !== unsafeFnName) {
          return;
        }

        report({
          messageId: `safe-in-array`,
          node: node.callee,
          fix: (fixer) => {
            const fixes = [fixer.replaceText(node.callee, safeFnName)];

            const hasImport = sourceCode.ast.body.some(
              (node) =>
                node.type === AST_NODE_TYPES.ImportDeclaration &&
                node.specifiers.some(
                  (spec) =>
                    spec.type === AST_NODE_TYPES.ImportSpecifier &&
                    spec.imported.type === AST_NODE_TYPES.Identifier &&
                    spec.imported.name === safeFnName
                )
            );

            if (!hasImport) {
              fixes.push(fixer.insertTextBefore(sourceCode.ast.body[0]!, `${importStatement}\n`));
            }

            return fixes;
          }
        });
      }
    };
  }
});
