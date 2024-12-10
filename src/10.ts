import _ from 'lodash';
import { readFileSync } from 'node:fs';

import { log } from './util/log';

const input = readFileSync('./input/10.txt', 'utf-8');
const lines = input.split('\n').filter((l) => l);
const grid = lines.map((l) => l.split('').map(Number));

function part1() {
  let sum = 0;
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y]!.length; x++) {
      const height = grid[y]![x]!;
      if (height === 0) {
        sum += getScore1(x, y);
      }
    }
  }
  return sum;
}

function part2() {
  let sum = 0;
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y]!.length; x++) {
      const height = grid[y]![x]!;
      if (height === 0) {
        sum += getScore2(x, y);
      }
    }
  }
  return sum;
}

function getScore1(x: number, y: number): number {
  const set = new Set<string>();
  getScoreRecursive(x, y, (x, y) => {
    set.add(`${x},${y}`);
  });
  return set.size;
}
function getScore2(x: number, y: number): number {
  let count = 0;
  getScoreRecursive(x, y, () => {
    count++;
  });
  return count;
}

function getScoreRecursive(x: number, y: number, onEnd: (x: number, y: number) => void): void {
  const height = grid[y]![x]!;
  if (height === 9) {
    onEnd(x, y);
    return;
  }

  for (const [nx, ny] of [
    [x - 1, y],
    [x + 1, y],
    [x, y - 1],
    [x, y + 1]
  ] as const) {
    const nextHeight = grid[ny]?.[nx];
    if (nextHeight !== height + 1) {
      continue;
    }
    getScoreRecursive(nx, ny, onEnd);
  }
}

log({
  part1: part1(),
  part2: part2()
});
