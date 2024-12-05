import _ from 'lodash';
import { readFileSync } from 'node:fs';

import {log} from './util/log'

const input = readFileSync('./input/.txt', 'utf-8');
const lines = input.split('\n').filter(l => l);

function part1() {
}

function part2() {
}

log({
  part1: part1(),
  part2: part2(),
});
