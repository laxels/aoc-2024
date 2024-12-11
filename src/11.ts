import _ from 'lodash';
import { readFileSync } from 'node:fs';

import { log } from './util/log';

const input = readFileSync('./input/11.txt', 'utf-8');
const lines = input.split('\n').filter((l) => l);
const line = lines[0]!;
const nums = line.split(' ').map(Number);

function part1() {
  let count = 0;
  for (const n of nums) {
    count += countStones(n, 25);
  }
  return count;
}

function part2() {
  let count = 0;
  for (const n of nums) {
    count += countStones(n, 75);
  }
  return count;
}

const countStones = _.memoize(
  (n: number, iterations: number): number => {
    if (iterations === 0) {
      return 1;
    }
    if (n === 0) {
      return countStones(1, iterations - 1);
    }
    const str = n.toString();
    if (str.length % 2 === 0) {
      const mid = str.length / 2;
      const [a, b] = [Number(str.slice(0, mid)), Number(str.slice(mid))];
      return countStones(a, iterations - 1) + countStones(b, iterations - 1);
    }
    return countStones(n * 2024, iterations - 1);
  },
  (n, iterations) => `${n}-${iterations}`
);

log({
  part1: part1(),
  part2: part2()
});
