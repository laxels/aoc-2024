import { basename, dirname, join } from 'node:path';

import { createRule } from '../util';

export const libImport = createRule({
  name: `lib-import`,
  meta: {
    docs: {
      description: `Enforce imports use \`$lib\` alias when possible`
    },
    type: 'problem',
    messages: {
      'lib-import': `Use \`$lib\` alias instead of relative path`
    },
    schema: [],
    fixable: 'code'
  },
  defaultOptions: [],
  create({ report, filename }) {
    const dirAbsolute = dirname(filename);
    const dir = basename(dirAbsolute);
    return {
      ImportDeclaration(node) {
        const importPathNode = node.source;
        const importPath = importPathNode.value.replace(/['"]/g, ``);

        // Only care about non-sibling/child relative imports and './lib/**/*' from 'src'
        if (!importPath.startsWith(`../`) && !(dir === `src` && /\.\/lib(\/|$)/.test(importPath))) {
          return;
        }

        const importPathAbsolute = join(dirAbsolute, importPath);
        const baseIndex = importPathAbsolute.search(/\/src\/lib(\/|$)/);
        if (baseIndex === -1) {
          // Import path not in `src/lib`
          return;
        }

        const startIndex = baseIndex + `/src/lib/`.length;
        const relativeToBase = importPathAbsolute.slice(startIndex);

        report({
          node: importPathNode,
          messageId: `lib-import`,
          fix: (fixer) => fixer.replaceText(importPathNode, `'${join(`$lib`, relativeToBase)}'`)
        });
      }
    };
  }
});
