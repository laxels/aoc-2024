import _ from 'lodash';
import { readFileSync } from 'node:fs';

import { log } from './util/log';

const input = readFileSync('./input/5.txt', 'utf-8');
const lines = input.split('\n').filter((l) => l);
const orderLines = lines.filter((l) => l.includes(`|`));
const updateLines = lines.filter((l) => !l.includes(`|`));

const orders = new Map<number, number[]>();
for (const line of orderLines) {
  const [before, after] = line
    .split(`|`)
    .map((s) => s.trim())
    .map(Number) as [number, number];
  orders.set(before, orders.get(before) ?? []);
  orders.get(before)!.push(after);
}

const updates = updateLines.map((l) => l.split(`,`).map(Number));

function part1() {
  return _.sum(updates.filter(isCorrectOrder).map(getMiddleNumber));
}

function part2() {
  const incorrectUpdates = updates.filter((arr) => !isCorrectOrder(arr));

  return _.sum(incorrectUpdates.map(toCorrectOrder).map(getMiddleNumber));
}

function isCorrectOrder(arr: number[]): boolean {
  const left = new Set<number>();
  for (const n of arr) {
    for (const m of orders.get(n) ?? []) {
      if (left.has(m)) {
        return false;
      }
    }
    left.add(n);
  }
  return true;
}

function toCorrectOrder(arr: number[]): number[] {
  return arr.toSorted((a, b) => {
    if (orders.get(a)?.includes(b)) {
      return -1;
    }
    if (orders.get(b)?.includes(a)) {
      return 1;
    }
    return 0;
  });
}

function getMiddleNumber(arr: number[]): number {
  return arr[Math.floor(arr.length / 2)]!;
}

log({
  part1: part1(),
  part2: part2()
});
