/*
  eslint no-restricted-imports: ["error", {"patterns": ["*"]}]
  -----
  This file should not import anything because it is imported by files that
  must be imported/run before anything else is imported/run (initialization code).

  If an import NEEDS to be added, first ensure that it plays nicely with the considerations above.
  If it does, then add it and disable this specific ESLint rule for that import line only.
*/

const escapeRegex = /\\(["\\/bfnrt]|u[0-9a-fA-F]{4}|.)/g;
const validEscapeRegex = /\\(["\\/bfnrt]|u[0-9a-fA-F]{4})/;

/**
 * Sanitizes a JSON string by removing invalid escape sequences.
 * @param jsonString The JSON string to sanitize.
 * @returns The sanitized JSON string.
 */
export function sanitizeJsonString(jsonString: string): string {
  return jsonString.replace(escapeRegex, (match) => {
    if (validEscapeRegex.test(match)) {
      return match;
    }
    // Strip leading backslash from invalid escape sequences.
    return match.slice(1);
  });
}
