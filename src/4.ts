import _ from 'lodash';
import { readFileSync } from 'node:fs';

import { log } from './util/log';

const input = readFileSync('./input/4.txt', 'utf-8');
const lines = input.split('\n').filter((l) => l);
const grid = lines.map((line) => line.split(''));

function part1() {
  log(grid);
}

function part2() {}

log({
  part1: part1(),
  part2: part2()
});
