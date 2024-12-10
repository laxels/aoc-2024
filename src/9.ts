import _ from 'lodash';
import { readFileSync } from 'node:fs';

import { log } from './util/log';

const input = readFileSync('./input/9.txt', 'utf-8');
// const input = `2333133121414131402`;
const lines = input.split('\n').filter((l) => l);
const line = lines[0]!;

const spaces: Array<number | null> = [];
const chars = line.split(``);
let id = 0;
for (let i = 0; i < chars.length; i++) {
  const c = chars[i]!;
  if (i % 2 === 0) {
    for (let i = 0; i < Number(c); i++) {
      spaces.push(id);
    }
    id++;
  } else {
    for (let i = 0; i < Number(c); i++) {
      spaces.push(null);
    }
  }
}

function part1() {
  const spacesCopy = [...spaces];
  let j = spacesCopy.findLastIndex((s) => s != null);

  for (let i = 0; i < spacesCopy.length; i++) {
    if (i >= j) {
      break;
    }
    const space = spacesCopy[i]!;
    if (space != null) {
      continue;
    }
    spacesCopy[i] = spacesCopy[j]!;
    spacesCopy[j] = null;
    while (spacesCopy[j] == null && j > 0) {
      j--;
    }
  }

  return spacesCopy.reduce((acc, s, i) => {
    if (s == null) {
      return acc;
    }
    return acc! + s * i;
  }, 0);
}

function part2() {
  const spacesCopy = [...spaces];
  let j = spacesCopy.findLastIndex((s) => s != null);

  while (true) {
    // log(`j`, j);
    if (j < 0) {
      break;
    }
    if (spacesCopy[j] == null) {
      j--;
      continue;
    }
    let fileEnd = j + 1;
    let fileStart = j;
    while (spacesCopy[fileStart - 1] === spacesCopy[j]!) {
      fileStart--;
    }

    const size = fileEnd - fileStart;

    for (let i = 0; i < spacesCopy.length; i++) {
      // log(`i`, i);
      if (i >= fileStart) {
        break;
      }
      if (spacesCopy[i] != null) {
        continue;
      }

      let end = i + 1;
      while (spacesCopy[end] === null) {
        end++;
      }
      const available = end - i;
      if (available < size) {
        continue;
      }

      for (let x = 0; x < size; x++) {
        spacesCopy[i + x] = spacesCopy[fileStart + x]!;
        spacesCopy[fileStart + x] = null;
      }
      break;
    }

    let nextJ = j - 1;
    while (nextJ >= 0 && (spacesCopy[nextJ] == null || spacesCopy[nextJ] === spacesCopy[j]!)) {
      nextJ--;
    }
    j = nextJ;
  }

  // log(`here`);

  return spacesCopy.reduce((acc, s, i) => {
    if (s == null) {
      return acc;
    }
    return acc! + s * i;
  }, 0);
}

log({
  part1: part1(),
  part2: part2()
});
