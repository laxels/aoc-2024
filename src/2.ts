import _ from 'lodash';
import { readFileSync } from 'node:fs';

import { log } from './util/log';

const input = readFileSync('./input/2.txt', 'utf-8');
const lines = input.split('\n').filter((l) => l);

function part1() {
  const reports = lines.map((line) => line.split(/\s+/).map(Number));
  return reports.filter(isSafe).length;
}

function part2() {
  const reports = lines.map((line) => line.split(/\s+/).map(Number));

  return reports.filter((report) => {
    const modifiedReports = report.map((_, i) => report.slice(0, i).concat(report.slice(i + 1)));
    return [report, ...modifiedReports].some(isSafe);
  }).length;
}

function isSafe(report: number[]): boolean {
  if (
    _.sortBy(report).join(` `) !== report.join(` `) &&
    _.sortBy(report).reverse().join(` `) !== report.join(` `)
  ) {
    return false;
  }
  return report.every((x, i) => {
    if (i === 0) {
      return true;
    }
    const diff = Math.abs(x - report[i - 1]!);
    return diff >= 1 && diff <= 3;
  });
}

log({
  part1: part1(),
  part2: part2()
});
