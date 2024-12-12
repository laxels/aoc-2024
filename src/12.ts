import _ from 'lodash';
import { readFileSync } from 'node:fs';

import { log } from './util/log';

const input = readFileSync('./input/12.txt', 'utf-8');
const lines = input.split('\n').filter((l) => l);
const grid = lines.map((l) => l.split(''));

function part1() {
  const totalVisited = new Set<string>();
  let cost = 0;
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y]!.length; x++) {
      if (totalVisited.has(`${x},${y}`)) {
        continue;
      }
      const { area, perimeter } = traverse(x, y, totalVisited);
      cost += area * perimeter;
    }
  }
  return cost;
}

function part2() {
  const totalVisited = new Set<string>();
  let cost = 0;
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y]!.length; x++) {
      if (totalVisited.has(`${x},${y}`)) {
        continue;
      }
      const { area, sides } = traverse(x, y, totalVisited);
      cost += area * sides;
    }
  }
  return cost;
}

function traverse(
  x: number,
  y: number,
  totalVisited: Set<string>
): { area: number; perimeter: number; sides: number } {
  const visited = new Set<string>();
  traverseRecursively(x, y, visited);
  for (const key of visited) {
    totalVisited.add(key);
  }
  return {
    area: getArea(visited),
    perimeter: getPerimeter(visited),
    sides: getSides(visited)
  };
}

function traverseRecursively(x: number, y: number, visited: Set<string>): void {
  const key = `${x},${y}`;
  if (visited.has(key)) {
    return;
  }
  visited.add(key);

  const cell = grid[y]![x]!;

  for (const [nx, ny] of [
    [x - 1, y],
    [x + 1, y],
    [x, y - 1],
    [x, y + 1]
  ] as const) {
    if (grid[ny]?.[nx] !== cell) {
      continue;
    }
    traverseRecursively(nx, ny, visited);
  }
}

function getArea(visited: Set<string>): number {
  return visited.size;
}

function getPerimeter(visited: Set<string>): number {
  let perimeter = 0;
  const coords = [...visited].map((k) => k.split(`,`).map(Number)) as Array<[number, number]>;
  const cell = grid[coords[0]![1]!]![coords[0]![0]!]!;

  for (const [x, y] of coords) {
    for (const [nx, ny] of [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1]
    ] as const) {
      if (grid[ny]?.[nx] !== cell) {
        perimeter++;
      }
    }
  }
  return perimeter;
}

function getSides(visited: Set<string>): number {
  const edges: Array<{ x: number; y: number; direction: `left` | `right` | `top` | `bottom` }> = [];
  const coords = [...visited].map((k) => k.split(`,`).map(Number)) as Array<[number, number]>;
  const cell = grid[coords[0]![1]!]![coords[0]![0]!]!;

  for (const [x, y] of coords) {
    for (const [nx, ny] of [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1]
    ] as const) {
      if (grid[ny]?.[nx] !== cell) {
        if (nx === x - 1) {
          edges.push({ x, y, direction: `left` });
        } else if (ny === y - 1) {
          edges.push({ x, y, direction: `top` });
        } else if (nx === x + 1) {
          edges.push({ x: nx, y, direction: `right` });
        } else if (ny === y + 1) {
          edges.push({ x, y: ny, direction: `bottom` });
        }
      }
    }
  }

  let sides = 0;
  let lastX = null;
  let lastY = null;
  for (const edge of _.sortBy(
    edges.filter((e) => e.direction === `left`),
    (e) => e.x,
    (e) => e.y
  )) {
    if (!(edge.x === lastX && lastY != null && edge.y === lastY + 1)) {
      sides++;
    }
    lastX = edge.x;
    lastY = edge.y;
  }
  lastX = null;
  lastY = null;
  for (const edge of _.sortBy(
    edges.filter((e) => e.direction === `right`),
    (e) => e.x,
    (e) => e.y
  )) {
    if (!(edge.x === lastX && lastY != null && edge.y === lastY + 1)) {
      sides++;
    }
    lastX = edge.x;
    lastY = edge.y;
  }

  lastX = null;
  lastY = null;
  for (const edge of _.sortBy(
    edges.filter((e) => e.direction === `top`),
    (e) => e.y,
    (e) => e.x
  )) {
    if (!(edge.y === lastY && lastX != null && edge.x === lastX + 1)) {
      sides++;
    }
    lastX = edge.x;
    lastY = edge.y;
  }

  lastX = null;
  lastY = null;
  for (const edge of _.sortBy(
    edges.filter((e) => e.direction === `bottom`),
    (e) => e.y,
    (e) => e.x
  )) {
    if (!(edge.y === lastY && lastX != null && edge.x === lastX + 1)) {
      sides++;
    }
    lastX = edge.x;
    lastY = edge.y;
  }

  return sides;
}

log({
  part1: part1(),
  part2: part2()
});
