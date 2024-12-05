import { describe, expect, it } from 'vitest';

import { parse } from '.';

describe('parse function', () => {
  it('should correctly parse JSON strings with invalid escapes', () => {
    const invalidJsonStrings = [
      '{"key": "value with invalid escape \\u"}',
      '{"key": "another invalid escape \\x"}',
      '{"key": "incomplete unicode escape \\u123"}',
      '{"key": "invalid control character \\a"}'
    ];

    invalidJsonStrings.forEach((jsonString) => {
      expect(() => parse(jsonString)).not.toThrow();
    });

    // Test specific cases
    expect(parse('{"key": "value with invalid escape \\u"}')).toEqual({
      key: 'value with invalid escape u'
    });
    expect(parse('{"key": "another invalid escape \\x"}')).toEqual({
      key: 'another invalid escape x'
    });
    expect(parse('{"key": "mixed \\n \\t \\x \\u1234 \\y escapes"}')).toEqual({
      key: 'mixed \n \t x \u1234 y escapes'
    });
  });
});
