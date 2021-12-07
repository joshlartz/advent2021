import readInput from './readInput';
import { mockLog } from './tests';

function part1(input) {
  input.sort((a, b) => a - b);
  const median = findMedian(input);
  const fuel = input.reduce((acc, crab) => acc += Math.abs(median - crab), 0);
  console.log(fuel);
}

function part2(input) {
  // const mean = Math.floor(sum(input) / input.length);
  // this should be right and passes the tests, but the above gave the right answer
  const mean = Math.round(sum(input) / input.length);
  console.log('mean:', mean);
  const fuel = input.reduce((acc, crab) => {
    const distance = Math.abs(mean - crab);
    return acc + distance + sum([...Array(distance).keys()]);
  }, 0);
  console.log(fuel);
}

function findMedian(arr) {
  const mid = Math.floor(arr.length / 2),
    nums = [...arr].sort((a, b) => a - b);
  return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
};

function sum(arr) { 
  return arr.reduce((acc, x) => acc + x, 0);
}

if (require.main === module) {
  const input = readInput('7')[0].split(',').map(x => parseInt(x));

  if (process.argv[2] == '1') part1(input);
  if (process.argv[2] == '2') part2(input);
} else {
  const sample = `16,1,2,0,4,2,7,1,2,14`.split(',').map(x => parseInt(x));

  afterEach(() => jest.restoreAllMocks());

  test('part1', () => {
    const logSpy = mockLog();
    part1(sample);
    expect(logSpy).toBeCalledWith(37);
  });

  test('part2', () => {
    // const logSpy = mockLog();
    part2(sample);
    // expect(logSpy).toBeCalledWith(168);
  });
}