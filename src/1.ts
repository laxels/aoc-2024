import _ from 'lodash';
import { readFileSync } from 'node:fs';

import { log } from './util/log';

function part1(): void {
  const input = readFileSync('./input/1.txt', 'utf-8');
  const lines = input.split('\n').filter((l) => l);
  const nums = lines.map((line) => line.split(/\s+/).map(Number)) as [number, number][];

  const list1 = _.sortBy(nums.map(([a, b]) => a));
  const list2 = _.sortBy(nums.map(([a, b]) => b));

  log(list1.reduce((acc, x, i) => acc + Math.abs(x - list2[i]!), 0));
}

// part1();

function part2(): void {
  const input = readFileSync('./input/1-1.txt', 'utf-8');
  const lines = input.split('\n').filter((l) => l);
  const nums = lines.map((line) => line.split(/\s+/).map(Number)) as [number, number][];

  const list1 = _.sortBy(nums.map(([a, b]) => a));
  const list2 = _.sortBy(nums.map(([a, b]) => b));

  const counts = _.countBy(list2);

  log(list1.reduce((acc, x) => acc + x * (counts[x] ?? 0), 0));
}

part2();
