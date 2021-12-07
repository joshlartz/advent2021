import { readFileSync } from 'fs';
import { basename } from 'path'

export function readInput(day: string): string[] {
  return readFileSync(`${__dirname}/../../inputs/day${day}.txt`, { encoding: 'utf-8'}).split('\n');
}

export function day(filename) {
  return basename(filename).match(/\d{1,2}/)[0];
}

export const mockLog = () => jest.spyOn(console, 'log').mockImplementation();
