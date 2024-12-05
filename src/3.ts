import _ from 'lodash';
import { readFileSync } from 'node:fs';

import { log } from './util/log';

const input = readFileSync('./input/3.txt', 'utf-8');

function part1() {
  let sum = 0;
  input.matchAll(/mul\((\d{1,3}),(\d{1,3})\)/g).forEach(([_, a, b]) => {
    sum += Number(a) * Number(b);
  });
  return sum;
}

function part2() {
  let sum = 0;
  let enabled = true;
  input.matchAll(/mul\((\d{1,3}),(\d{1,3})\)|do\(\)|don't\(\)/g).forEach(([m, a, b]) => {
    if (m === 'do()') {
      enabled = true;
    } else if (m === "don't()") {
      enabled = false;
    } else if (enabled) {
      sum += Number(a) * Number(b);
    }
  });
  return sum;
}

log({
  part1: part1(),
  part2: part2()
});
