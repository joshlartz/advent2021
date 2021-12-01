import { readFileSync } from 'fs';

export default function readInput(day: string): string[] {
  return readFileSync(`${__dirname}/../../inputs/day${day}.txt`, { encoding: 'utf-8'}).split('\n');
}
