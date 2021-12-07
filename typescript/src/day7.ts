import { readInput, day, mockLog } from './helpers';

function part1(input) {
  input.sort((a, b) => a - b);
  const median = findMedian(input);
  const fuel = input.reduce((acc, crab) => (acc += Math.abs(median - crab)), 0);
  console.log(fuel);
}

function part2(input) {
  const flooredMean = Math.floor(sum(input) / input.length);
  // this should be right and passes the tests, but the above gave the right answer
  const mean = Math.round(sum(input) / input.length);

  const fuels = [calcFuel(input, flooredMean), calcFuel(input, mean)];
  fuels.sort((a, b) => a - b);
  console.log(fuels[0]);
}

function calcFuel(input, mean) {
  return input.reduce((acc, crab) => {
    const distance = Math.abs(mean - crab);
    return acc + distance + seriesSum(distance - 1);
  }, 0);
}

/** expects sorted */
function findMedian(arr) {
  const mid = Math.floor(arr.length / 2);
  return arr.length % 2 !== 0 ? arr[mid] : (arr[mid - 1] + arr[mid]) / 2;
}

function sum(arr) {
  return arr.reduce((acc, x) => acc + x, 0);
}

function seriesSum(n) {
  return (n * (n + 1)) / 2;
}

if (require.main === module) {
  const input = readInput(day(__filename))[0]
    .split(',')
    .map(x => parseInt(x));
  
  if (process.argv[2] == '1') part1(input);
  else if (process.argv[2] == '2') part2(input);
  else {
    console.log(`day ${day(__filename)}`);
    console.time('part 1');
    part1(input);
    console.timeEnd('part 1');
    console.time('part 2');
    part2(input);
    console.timeEnd('part 2');
  }
} else {
  const sample = `16,1,2,0,4,2,7,1,2,14`.split(',').map(x => parseInt(x));

  afterEach(() => jest.restoreAllMocks());

  test('part1', () => {
    const logSpy = mockLog();
    part1(sample);
    expect(logSpy).toBeCalledWith(37);
  });

  test('part2', () => {
    const logSpy = mockLog();
    part2(sample);
    expect(logSpy).toBeCalledWith(168);
  });
}
