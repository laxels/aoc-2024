import _ from 'lodash';
import { readFileSync } from 'node:fs';
import { produce } from 'immer';

import { log } from './util/log';

const input = readFileSync('./input/6.txt', 'utf-8');
const lines = input.split('\n').filter((l) => l);
const grid = lines.map((l) => l.split(''));

type Direction = `up` | `down` | `left` | `right`;

function part1() {
  let direction: Direction = `up`;
  let [x, y] = getInitialPosition();
  const visited = new Set<string>();

  while (true) {
    visited.add(`${x},${y}`);

    const [nx, ny] = (() => {
      switch (direction) {
        case `up`:
          return [x, y - 1];
        case `down`:
          return [x, y + 1];
        case `left`:
          return [x - 1, y];
        case `right`:
          return [x + 1, y];
      }
    })();

    if (isOutOfBounds(nx, ny)) {
      break;
    }

    if (grid[ny]![nx] === `#`) {
      direction = getNextDirection(direction);
      continue;
    }

    [x, y] = [nx, ny];
  }

  return visited.size;
}

function part2() {
  const grids = getGrids();
  let count = 0;
  for (const grid of grids) {
    if (hasLoop(grid)) {
      count++;
    }
  }
  return count;
}

function getInitialPosition(): [number, number] {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y]!.length; x++) {
      if (grid[y]![x] === `^`) {
        return [x, y];
      }
    }
  }
  throw new Error(`No initial position found`);
}

function isOutOfBounds(x: number, y: number): boolean {
  return x < 0 || y < 0 || x >= grid[0]!.length || y >= grid.length;
}

function getNextDirection(direction: Direction): Direction {
  switch (direction) {
    case `up`:
      return `right`;
    case `right`:
      return `down`;
    case `down`:
      return `left`;
    case `left`:
      return `up`;
  }
}

function getAllObstacles(): [number, number][] {
  const obstacles: [number, number][] = [];
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y]!.length; x++) {
      if (grid[y]![x] === `#`) {
        obstacles.push([x, y]);
      }
    }
  }
  return obstacles;
}

function getGrids(): string[][][] {
  const grids: string[][][] = [];
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y]!.length; x++) {
      if (grid[y]![x] === `#` || grid[y]![x] === `^`) {
        continue;
      }
      grids.push(
        produce(grid, (draft) => {
          draft[y]![x] = `#`;
        })
      );
    }
  }
  return grids;
}

function hasLoop(grid: string[][]): boolean {
  let direction: Direction = `up`;
  let [x, y] = getInitialPosition();
  const visited = new Set<string>();

  while (true) {
    const key = `${x},${y},${direction}`;
    if (visited.has(key)) {
      return true;
    }
    visited.add(key);

    const [nx, ny] = (() => {
      switch (direction) {
        case `up`:
          return [x, y - 1];
        case `down`:
          return [x, y + 1];
        case `left`:
          return [x - 1, y];
        case `right`:
          return [x + 1, y];
      }
    })();

    if (isOutOfBounds(nx, ny)) {
      return false;
    }

    if (grid[ny]![nx] === `#`) {
      direction = getNextDirection(direction);
      continue;
    }

    [x, y] = [nx, ny];
  }
}

log({
  part1: part1(),
  part2: part2()
});
