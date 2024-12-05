import _ from 'lodash';
import { readFileSync } from 'node:fs';

import { log } from './util/log';

const input = readFileSync('./input/4.txt', 'utf-8');
// const input = `
// MMMSXXMASM
// MSAMXMSMSA
// AMXSXMAAMM
// MSAMASMSMX
// XMASAMXAMM
// XXAMMXXAMA
// SMSMSASXSS
// SAXAMASAAA
// MAMMMXMMMM
// MXMXAXMASX
// `;
const lines = input.split('\n').filter((l) => l);
const grid = lines.map((line) => line.split(''));

function part1() {
  let count = 0;
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y]!.length; x++) {
      count += traverse1(x, y, (x, y) => ({ x: x - 1, y }));
      count += traverse1(x, y, (x, y) => ({ x: x + 1, y }));
      count += traverse1(x, y, (x, y) => ({ x, y: y - 1 }));
      count += traverse1(x, y, (x, y) => ({ x, y: y + 1 }));
      count += traverse1(x, y, (x, y) => ({ x: x - 1, y: y - 1 }));
      count += traverse1(x, y, (x, y) => ({ x: x + 1, y: y - 1 }));
      count += traverse1(x, y, (x, y) => ({ x: x - 1, y: y + 1 }));
      count += traverse1(x, y, (x, y) => ({ x: x + 1, y: y + 1 }));
    }
  }
  return count;
}

function traverse1(
  x: number,
  y: number,
  getNext: (x: number, y: number) => { x: number; y: number },
  chars = [`X`, `M`, `A`, `S`]
): 0 | 1 {
  if (grid[y] == null || grid[y][x] == null) {
    return 0;
  }

  if (chars[0] !== grid[y][x]) {
    return 0;
  }

  if (chars.length === 1) {
    return 1;
  }

  const next = getNext(x, y);
  return traverse1(next.x, next.y, getNext, chars.slice(1));
}

function part2() {
  let count = 0;
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y]!.length; x++) {
      count += traverse2(x, y);
    }
  }
  return count;
}

function traverse2(x: number, y: number): 0 | 1 {
  if (grid[y] == null || grid[y][x] == null) {
    return 0;
  }

  if (grid[y][x] !== `A`) {
    return 0;
  }

  const set1 = new Set<string | undefined>();
  const set2 = new Set<string | undefined>();

  set1.add(grid[y - 1]?.[x - 1]);
  set1.add(grid[y + 1]?.[x + 1]);
  set2.add(grid[y - 1]?.[x + 1]);
  set2.add(grid[y + 1]?.[x - 1]);

  return set1.has(`M`) && set1.has(`S`) && set2.has(`M`) && set2.has(`S`) ? 1 : 0;
}

log({
  part1: part1(),
  part2: part2()
});
