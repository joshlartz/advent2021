import { readInput, day, mockLog } from './helpers';

type Input = string[][];

function part1(input: Input) {
  let grid: Input = JSON.parse(JSON.stringify(input));
  let stopped: number;

  // print(grid, 0);
  for (let step = 1; step <= 10_000; step++) {
    const east = move('>', grid);
    const south = move('v', grid);
    if (!east && !south) {
      stopped = step;
      break;
    }
    // print(grid, step);
  }
  console.log(stopped);
}

function part2(input: Input) {}

function move(cucumber: '>' | 'v', grid: Input) {
  let willMove = [];
  let willReset = [];

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      if (grid[y][x] === cucumber) {
        if (cucumber === '>') {
          const next = grid[y][x + 1] ? x + 1 : 0;
          if (grid[y][next] === '.') {
            willMove.push({ y, x: next });
            willReset.push({ y, x });
          }
        } else {
          const next = grid[y + 1]?.[x] ? y + 1 : 0;
          if (grid[next][x] === '.') {
            willMove.push({ y: next, x });
            willReset.push({ y, x });
          }
        }
      }
    }
  }

  if (willMove.length === 0) return false;
  willMove.forEach(coord => (grid[coord.y][coord.x] = cucumber));
  willReset.forEach(coord => (grid[coord.y][coord.x] = '.'));
  return true;
}

function parseInput(input: string[]): Input {
  return input.filter(x => x).map(line => line.split(''));
}

function print(grid: Input, step: number) {
  console.log(`After ${step} steps:`);
  grid.forEach(line => console.log(line.join('')));
  console.log('');
}

if (require.main === module) {
  const input = parseInput(readInput(day(__filename)));

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
  const sample = `v...>>.vv>
.vv>>.vv..
>>.>v>...v
>>v>>.>.v.
v>v.vv.v..
>.>>..v...
.vv..>.>v.
v.v..>>v.v
....v..v.>`.split('\n');

  afterEach(() => jest.restoreAllMocks());

  test('part1', () => {
    const logSpy = mockLog();
    part1(parseInput(sample));
    expect(logSpy).toBeCalledWith(58);
  });

  // test('part2', () => {
  //   const logSpy = mockLog();
  //   part2(parseInput(sample));
  //   expect(logSpy).toBeCalledWith(3351);
  // });
}
