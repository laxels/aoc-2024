import type { Linter } from '@typescript-eslint/utils/ts-eslint';

import { executableScript } from './rules/executable-script';
import { libImport } from './rules/lib-import';
import { safeInArray } from './rules/safe-in-array';
import { scriptExit } from './rules/script-exit';

export default {
  rules: {
    'lib-import': libImport,
    'safe-in-array': safeInArray,

    'executable-script': executableScript,
    'script-exit': scriptExit
  }
} satisfies Linter.Plugin;
