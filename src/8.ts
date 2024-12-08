import _ from 'lodash';
import { readFileSync } from 'node:fs';

import { log } from './util/log';

const input = readFileSync('./input/8.txt', 'utf-8');
const lines = input.split('\n').filter((l) => l);
const grid = lines.map((l) => l.split(''));

type Coord = {
  x: number;
  y: number;
};

const frequencyToCoords = new Map<string, Coord[]>();

for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < grid[y]!.length; x++) {
    const frequency = grid[y]![x]!;
    if (frequency === '.') {
      continue;
    }
    frequencyToCoords.set(frequency, [...(frequencyToCoords.get(frequency) ?? []), { x, y }]);
  }
}

function part1() {
  const antinodes = new Set<string>();

  for (const [frequency, coords] of frequencyToCoords.entries()) {
    if (coords.length === 1) {
      continue;
    }

    for (const { x: x1, y: y1 } of coords) {
      for (const { x: x2, y: y2 } of coords) {
        if (x1 === x2 && y1 === y2) {
          continue;
        }
        const distX = x2 - x1;
        const distY = y2 - y1;

        const xa = x1 + 2 * distX;
        const ya = y1 + 2 * distY;

        if (grid[ya]?.[xa] == null) {
          continue;
        }

        antinodes.add(`${xa},${ya}`);
      }
    }
  }

  return antinodes.size;
}

function part2() {
  const antinodes = new Set<string>();

  for (const [frequency, coords] of frequencyToCoords.entries()) {
    if (coords.length === 1) {
      continue;
    }

    for (const { x: x1, y: y1 } of coords) {
      for (const { x: x2, y: y2 } of coords) {
        if (x1 === x2 && y1 === y2) {
          continue;
        }
        const distX = x2 - x1;
        const distY = y2 - y1;

        let mult = 1;
        while (true) {
          const xa = x1 + mult * distX;
          const ya = y1 + mult * distY;
          if (grid[ya]?.[xa] == null) {
            break;
          }
          antinodes.add(`${xa},${ya}`);
          mult++;
        }
      }
    }
  }

  return antinodes.size;
}

log({
  part1: part1(),
  part2: part2()
});
