// eslint-plugin/util.ts
import { ESLintUtils } from "@typescript-eslint/utils";
var createRule = ESLintUtils.RuleCreator(() => ``);

// eslint-plugin/rules/executable-script.ts
var shebangLine = `#! /usr/bin/env -S yarn vite-node --options.transformMode.ssr=/.*/`;
var executableScript = createRule({
  name: `executable-script`,
  meta: {
    docs: {
      description: `Enforces that scripts are executable using \`vite-node\``
    },
    type: `problem`,
    messages: {
      "executable-script": `Scripts must be executable using \`vite-node\``
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
        const hasShebang = firstLine != null && firstLine.startsWith("#!");
        report({
          node,
          messageId: "executable-script",
          fix: (fixer) => {
            if (hasShebang) {
              const range = [0, firstLine.length];
              return fixer.replaceTextRange(range, shebangLine);
            }
            return fixer.insertTextBeforeRange([0, 0], `${shebangLine}

`);
          }
        });
      }
    };
  }
});

// eslint-plugin/rules/lib-import.ts
import { basename, dirname, join } from "node:path";
var libImport = createRule({
  name: `lib-import`,
  meta: {
    docs: {
      description: `Enforce imports use \`$lib\` alias when possible`
    },
    type: "problem",
    messages: {
      "lib-import": `Use \`$lib\` alias instead of relative path`
    },
    schema: [],
    fixable: "code"
  },
  defaultOptions: [],
  create({ report, filename }) {
    const dirAbsolute = dirname(filename);
    const dir = basename(dirAbsolute);
    return {
      ImportDeclaration(node) {
        const importPathNode = node.source;
        const importPath2 = importPathNode.value.replace(/['"]/g, ``);
        if (!importPath2.startsWith(`../`) && !(dir === `src` && /\.\/lib(\/|$)/.test(importPath2))) {
          return;
        }
        const importPathAbsolute = join(dirAbsolute, importPath2);
        const baseIndex = importPathAbsolute.search(/\/src\/lib(\/|$)/);
        if (baseIndex === -1) {
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

// eslint-plugin/rules/safe-in-array.ts
import { AST_NODE_TYPES } from "@typescript-eslint/utils";
var unsafeFnName = `inArray`;
var safeFnName = `safeInArray`;
var importPath = `$lib/server/db/util`;
var importStatement = `import { ${safeFnName} } from '${importPath}';`;
var safeInArray = createRule({
  name: `safe-in-array`,
  meta: {
    docs: {
      description: `Enforces usage of \`${safeFnName}\` Drizzle helper`
    },
    type: `problem`,
    messages: {
      "safe-in-array": `Use \`${safeFnName}\` helper instead of \`${unsafeFnName}\``
    },
    schema: [],
    fixable: `code`
  },
  defaultOptions: [],
  create: ({ report, sourceCode }) => {
    return {
      CallExpression(node) {
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
              (node2) => node2.type === AST_NODE_TYPES.ImportDeclaration && node2.specifiers.some(
                (spec) => spec.type === AST_NODE_TYPES.ImportSpecifier && spec.imported.type === AST_NODE_TYPES.Identifier && spec.imported.name === safeFnName
              )
            );
            if (!hasImport) {
              fixes.push(fixer.insertTextBefore(sourceCode.ast.body[0], `${importStatement}
`));
            }
            return fixes;
          }
        });
      }
    };
  }
});

// eslint-plugin/rules/script-exit.ts
var exitLine = `process.exit(0);`;
var scriptExit = createRule({
  name: `script-exit`,
  meta: {
    docs: {
      description: `Enforces that scripts exit properly`
    },
    type: `problem`,
    messages: {
      "script-exit": `Scripts must exit properly`
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
          messageId: "script-exit",
          fix: (fixer) => fixer.insertTextAfter(node, `

${exitLine}`)
        });
      }
    };
  }
});

// eslint-plugin/index.ts
var eslint_plugin_default = {
  rules: {
    "lib-import": libImport,
    "safe-in-array": safeInArray,
    "executable-script": executableScript,
    "script-exit": scriptExit
  }
};
export {
  eslint_plugin_default as default
};
