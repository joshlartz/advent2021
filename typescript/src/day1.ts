import readInput from './readInput';
import { mockLog } from './tests';

const reduce = depths =>
  depths.reduce((acc, depth, index, array) => {
    acc += Number(depth > array[index - 1]);
    return acc;
  }, 0);

function part1(input) {
  console.log(reduce(input));
}

function part2(input) {
  const threeSums = input
    .map((depth, index, array) => {
      if (index + 2 < array.length - 1) return depth + array[index + 1] + array[index + 2];
    })
    .filter(x => x);

  console.log(reduce(threeSums));
}

if (require.main === module) {
  const input = readInput('1').map(x => parseInt(x));

  if (process.argv[2] == '1') part1(input);
  if (process.argv[2] == '2') part2(input);
} else {
  const sample = `199
200
208
210
200
207
240
269
260
263`.split('\n');

  test('part1', () => {
    const logSpy = mockLog();
    part1(sample);
    expect(logSpy).toBeCalledWith(7);
  });

  test('part2', () => {
    const logSpy = mockLog();
    part2(sample);
    expect(logSpy).toBeCalledWith(5);
  });
}
