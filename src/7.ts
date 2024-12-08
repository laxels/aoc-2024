import _ from 'lodash';
import { readFileSync } from 'node:fs';

import { log } from './util/log';

const input = readFileSync('./input/7.txt', 'utf-8');
const lines = input.split('\n').filter((l) => l);

type Test = {
  result: number;
  nums: number[];
};

const tests: Test[] = lines.map((l) => {
  const [resultStr, numsStr] = l.split(`: `);
  const result = Number(resultStr);
  const nums = numsStr!.split(' ').map(Number);
  return { result, nums };
});

function part1() {
  return _.sum(tests.filter(isTestGood1).map((t) => t.result));
}

function part2() {
  return _.sum(tests.filter(isTestGood2).map((t) => t.result));
}

function isTestGood1({ result, nums }: Test): boolean {
  if (nums.length === 1) {
    return nums[0]! === result;
  }
  return (
    isTestGood1({ result, nums: [nums[0]! + nums[1]!, ...nums.slice(2)] }) ||
    isTestGood1({ result, nums: [nums[0]! * nums[1]!, ...nums.slice(2)] })
  );
}

function isTestGood2({ result, nums }: Test): boolean {
  if (nums.length === 1) {
    return nums[0]! === result;
  }
  return (
    isTestGood2({ result, nums: [nums[0]! + nums[1]!, ...nums.slice(2)] }) ||
    isTestGood2({ result, nums: [nums[0]! * nums[1]!, ...nums.slice(2)] }) ||
    isTestGood2({ result, nums: [concat(nums[0]!, nums[1]!), ...nums.slice(2)] })
  );
}

function concat(a: number, b: number): number {
  return Number(`${a}${b}`);
}

log({
  part1: part1(),
  part2: part2()
});
