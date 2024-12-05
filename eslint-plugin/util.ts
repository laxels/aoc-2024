import { ESLintUtils } from '@typescript-eslint/utils';

// We don't have docs for any custom rules yet, so we'll use an empty string for the URL
export const createRule = ESLintUtils.RuleCreator(() => ``);
