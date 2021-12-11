import { readInput, day, mockLog } from './helpers';

function part1(input: number[][], steps: number) {
  let flashCount = 0;

  for (let s = 0; s < steps; s++) {
    let flashes = createGrid(10);

    incrementOctopi(input);

    function checkFlashes(input) {
      for (let y = 0; y < input.length; y++) {
        for (let x = 0; x < input[0].length; x++) {
          if (input[y][x] > 9 && !flashes[y][x]) {
            flashes[y][x]++;
            flashCount++;
            incrementNeighbors(input, y, x);
            checkFlashes(input);
          }
        }
      }
    }
    checkFlashes(input);
    resetFlashes(input, flashes);
  }
  console.log(flashCount);
}

function part2(input: number[][]) {
  let step = 0;
  let found = 0;

  while(found === 0) {
    step++;
    let flashes = createGrid(10);
    let flashCount = 0;

    incrementOctopi(input);

    function checkFlashes(input) {
      for (let y = 0; y < input.length; y++) {
        for (let x = 0; x < input[0].length; x++) {
          if (input[y][x] > 9 && !flashes[y][x]) {
            flashes[y][x]++;
            flashCount++;
            incrementNeighbors(input, y, x);
            checkFlashes(input);
          }
        }
      }
    }
    checkFlashes(input);
    if (flashCount === input.length * input[0].length) found = step;
    resetFlashes(input, flashes);
  }
  console.log(found);
}

function incrementOctopi(input) {
  for (let y = 0; y < input.length; y++) for (let x = 0; x < input[0].length; x++) input[y][x]++;
}

function incrementNeighbors(input, y: number, x: number) {
  const yEnd = input.length - 1;
  const xEnd = input[0].length - 1;
  if (y > 0 && x > 0) input[y - 1][x - 1]++; // top left
  if (y < yEnd && x < xEnd) input[y + 1][x + 1]++; // bottom right
  if (y > 0) {
    input[y - 1][x]++; // top
    if (x < xEnd) input[y - 1][x + 1]++; // top right
  }
  if (x > 0) {
    input[y][x - 1]++; // left
    if (y < yEnd) input[y + 1][x - 1]++; // bottom left
  }
  if (x < xEnd) input[y][x + 1]++; // right
  if (y < yEnd) input[y + 1][x]++; // bottom
}

function resetFlashes(input, flashes) {
  for (let y = 0; y < input.length; y++)
    for (let x = 0; x < input[0].length; x++) if (flashes[y][x]) input[y][x] = 0;
}

function createGrid(size) {
  return new Array(size).fill(null).map(() => new Array(size).fill(null).map(() => 0));
}

function parseInput(input: string[]) {
  return input.filter(x => x).map(line => line.split('').map(num => parseInt(num)));
}

function print(input) {
  input.forEach(line => console.log(line.join('')));
  console.log('\n');
}

if (require.main === module) {
  const input = parseInput(readInput(day(__filename)));

  if (process.argv[2] == '1') part1(input, 100);
  else if (process.argv[2] == '2') part2(input);
  else {
    console.log(`day ${day(__filename)}`);
    console.time('part 1');
    part1(input, 100);
    console.timeEnd('part 1');
    console.time('part 2');
    part2(input);
    console.timeEnd('part 2');
  }
} else {
  const sample = `5483143223
2745854711
5264556173
6141336146
6357385478
4167524645
2176841721
6882881134
4846848554
5283751526`.split('\n');

  afterEach(() => jest.restoreAllMocks());

  test('part1 10 steps', () => {
    const logSpy = mockLog();
    part1(parseInput(sample), 10);
    expect(logSpy).toBeCalledWith(204);
  });

  test('part1 100 steps', () => {
    const logSpy = mockLog();
    part1(parseInput(sample), 100);
    expect(logSpy).toBeCalledWith(1656);
  });

  test('part2 sample2', () => {
    const logSpy = mockLog();
    part2(parseInput(sample));
    expect(logSpy).toBeCalledWith(195);
  });
}
