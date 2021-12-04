import readInput from './readInput';
import { mockLog } from './tests';

function columnCounts(input: string[]) {
  const columnCounts = new Array(input[0].length).fill(undefined).map(_ => ({ zero: 0, one: 0 }));

  for (let i = 0; i < input[0].length; i++) {
    input.forEach(num => {
      if (parseInt(num[i])) columnCounts[i].one++;
      else columnCounts[i].zero++;
    });
  }

  return columnCounts;
}

const mostCommon = input =>
  columnCounts(input)
    .map(counts => (counts.one >= counts.zero ? '1' : '0'))
    .join('');
const leastCommon = input =>
  columnCounts(input)
    .map(counts => (counts.one < counts.zero ? '1' : '0'))
    .join('');

function part1(input) {
  const gamma = mostCommon(input);
  const epsilon = leastCommon(input);

  console.log(parseInt(gamma, 2) * parseInt(epsilon, 2));
}

function part2(input: string[]) {
  let oxygen = Array.from(input);
  let co2 = Array.from(input);

  for (let i = 0; i < input[0].length; i++) {
    if (oxygen.length > 1) oxygen = oxygen.filter(num => mostCommon(oxygen)[i] == num[i]);
    if (co2.length > 1) co2 = co2.filter(num => leastCommon(co2)[i] == num[i]);
  }

  console.log(parseInt(oxygen[0], 2) * parseInt(co2[0], 2));
}

if (require.main === module) {
  const input = readInput('3');

  if (process.argv[2] == '1') part1(input);
  if (process.argv[2] == '2') part2(input);
} else {
  const sample = `00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010`.split('\n');

  test('part1', () => {
    const logSpy = mockLog();
    part1(sample);
    expect(logSpy).toBeCalledWith(198);
  });

  test('part2', () => {
    const logSpy = mockLog();
    part2(sample);
    expect(logSpy).toBeCalledWith(230);
  });
}
