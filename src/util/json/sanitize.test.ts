import { describe, expect, it } from 'vitest';

import { sanitizeJsonString } from './sanitize';

describe('vanilla `JSON.parse` with invalid escapes', () => {
  it('should throw an error for JSON strings with invalid escapes', () => {
    const invalidJsonStrings = [
      '{"key": "value with invalid escape \\u"}',
      '{"key": "another invalid escape \\x"}',
      '{"key": "incomplete unicode escape \\u123"}',
      '{"key": "invalid control character \\a"}'
    ];

    invalidJsonStrings.forEach((jsonString) => {
      expect(() => JSON.parse(jsonString)).toThrow();
    });
  });

  it('should not throw for valid JSON strings', () => {
    const validJsonStrings = [
      '{"key": "valid string"}',
      '{"key": "valid escape \\n"}',
      '{"key": "valid unicode escape \\u1234"}'
    ];

    validJsonStrings.forEach((jsonString) => {
      expect(() => JSON.parse(jsonString)).not.toThrow();
    });
  });
});

describe('sanitizeJsonString', () => {
  it('should remove invalid escape sequences', () => {
    const input = '{"key": "value with invalid escape \\u"}';
    const expected = '{"key": "value with invalid escape u"}';
    expect(sanitizeJsonString(input)).toBe(expected);
  });

  it('should keep valid escape sequences', () => {
    const input = '{"key": "valid escape \\n and unicode \\u1234"}';
    expect(sanitizeJsonString(input)).toBe(input);
  });

  it('should handle multiple invalid escapes', () => {
    const input = '{"key": "multiple \\x \\y \\z invalid escapes"}';
    const expected = '{"key": "multiple x y z invalid escapes"}';
    expect(sanitizeJsonString(input)).toBe(expected);
  });

  it('should handle mixed valid and invalid escapes', () => {
    const input = '{"key": "mixed \\n \\t \\x \\u1234 \\y escapes"}';
    const expected = '{"key": "mixed \\n \\t x \\u1234 y escapes"}';
    expect(sanitizeJsonString(input)).toBe(expected);
  });

  it('should not modify strings without escapes', () => {
    const input = '{"key": "normal string"}';
    expect(sanitizeJsonString(input)).toBe(input);
  });

  it('should handle empty strings', () => {
    expect(sanitizeJsonString('')).toBe('');
  });

  it('should `JSON.parse` correctly after sanitization', () => {
    const input = '{"key": "value with invalid escape \\x"}';
    const sanitized = sanitizeJsonString(input);
    expect(() => JSON.parse(sanitized)).not.toThrow();
  });

  it('should handle double backslash', () => {
    const input = '{"key": "double backslash \\\\n and \\\\x"}';
    const expected = '{"key": "double backslash \\\\n and \\\\x"}';
    expect(sanitizeJsonString(input)).toBe(expected);
  });

  it('should handle triple backslash followed by valid and invalid escapes', () => {
    const input = '{"key": "triple backslash \\\\\\n and \\\\\\x"}';
    const expected = '{"key": "triple backslash \\\\\\n and \\\\x"}';
    expect(sanitizeJsonString(input)).toBe(expected);
  });
});
