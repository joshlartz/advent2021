import readInput from './readInput';
import { mockLog } from './tests';

function part1(input, days) {
  console.log(spawnFishAndCount(input, days));
}

function part2(input, days) {
  console.log(spawnFish(input, days));
}

// brute force
function spawnFishAndCount(input, days) {
  let fish: number[] = [...input];

  for (let day = 1; day <= days; day++) {
    let newFish = [];
    fish.forEach((f, i) => {
      if (f === 0) {
        fish[i] = 6;
        newFish.push(8);
      } else {
        fish[i]--;
      }
    });
    fish.push(...newFish);
  }
  return fish.length;
}

function spawnFish(input: number[], days: number) {
  let fish: number[] = [];
  input.forEach(f => fish[f] = (fish[f] ?? 0) + 1);

  for (let day = 1; day <= days; day++) {
    const fishCount = fish.shift() ?? 0;
    fish[6] = (fish[6] ?? 0) + fishCount;
    fish[8] = fishCount;
  }

  return fish.reduce((acc, f) => acc + f);
}

if (require.main === module) {
  const input = readInput('6')[0].split(',');

  if (process.argv[2] == '1') part1(input, 80);
  if (process.argv[2] == '2') part2(input, 256);
} else {
  const sample = `3,4,3,1,2`.split(',');

  afterEach(() => jest.restoreAllMocks());

  test('part1 sample1', () => {
    const logSpy = mockLog();
    part1(sample, 18);
    expect(logSpy).toBeCalledWith(26);
  });

  test('part1 sample2', () => {
    const logSpy = mockLog();
    part1(sample, 80);
    expect(logSpy).toBeCalledWith(5934);
  });

  test('part2', () => {
    const logSpy = mockLog();
    part2(sample, 256);
    expect(logSpy).toBeCalledWith(26984457539);
  });
}
