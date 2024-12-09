import { wait } from '@laxels/utils';
import axios from 'axios';
import { differenceInMinutes, startOfTomorrow } from 'date-fns';
import { fromZonedTime } from 'date-fns-tz';
import { writeFileSync } from 'node:fs';
import { logError } from './util/log';

const sessionCookie = process.argv[2];
if (!sessionCookie) {
  logError('Please provide a session cookie as the first argument');
  process.exit(1);
}

while (true) {
  if (!shouldRun()) {
    await wait(5000);
    continue;
  }

  const day = getDay();

  try {
    const input = await fetchInput(day);
    writeFileSync(`./input/${day}.txt`, input);
    break;
  } catch (err) {
    logError(err);
  }
}

function getDay(): number {
  const now = new Date();
  return now.getUTCDate();
}

function shouldRun(): boolean {
  const now = new Date();
  const easternMidnight = fromZonedTime(startOfTomorrow(), 'America/New_York');
  return now >= easternMidnight && differenceInMinutes(now, easternMidnight) === 0;
}

async function fetchInput(day: number): Promise<string> {
  const { data } = await axios.get<string>(`https://adventofcode.com/2024/day/${day}/input`, {
    headers: {
      cookie: `session=${sessionCookie}`
    }
  });
  return data;
}
