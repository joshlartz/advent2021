import { readInput, day, mockLog } from './helpers';

type Input = { dots: { x: number; y: number }[]; folds: string[] };
type Grid = number[][];

function part1(input: Input) {
  let grid = createGrid(input);

  fold(grid, input.folds[0]);
  console.log(sum(grid));
}

function part2(input: Input) {
  let grid = createGrid(input);

  input.folds.forEach(f => fold(grid, f));
  // print(grid);

  // sample case
  if (grid[0].length === 5) console.log(letter(grid.slice(0, 5)));
  // go the extra mile and convert the characters to a string for programmatic submission
  else
    console.log(
      letter(grid.map(y => y.filter((_, x) => x >= 0 && x < 4))) +
        letter(grid.map(y => y.filter((_, x) => x >= 5 && x < 9))) +
        letter(grid.map(y => y.filter((_, x) => x >= 10 && x < 14))) +
        letter(grid.map(y => y.filter((_, x) => x >= 15 && x < 19))) +
        letter(grid.map(y => y.filter((_, x) => x >= 20 && x < 24))) +
        letter(grid.map(y => y.filter((_, x) => x >= 25 && x < 29))) +
        letter(grid.map(y => y.filter((_, x) => x >= 30 && x < 34))) +
        letter(grid.map(y => y.filter((_, x) => x >= 35 && x < 39)))
    );
}

function sum(grid: Grid) {
  return grid.reduce((acc, y) => acc + y.reduce((a, x) => a + x, 0), 0);
}

function fold(grid: Grid, fold) {
  const foldLine = parseInt(fold.split('=')[1]);
  if (fold.startsWith('y')) {
    const max = grid.length - 1;
    for (let i = max; i > foldLine; i--) {
      grid[i].forEach((_, x) => {
        if (grid[i][x]) grid[max - i][x] = 1;
      });
      grid.pop();
    }
    grid.pop();
  } else if (fold.startsWith('x')) {
    const max = grid[0].length - 1;
    grid.forEach((_, y) => {
      for (let i = max; i > foldLine; i--) {
        if (grid[y][i]) grid[y][max - i] = 1;
        grid[y].pop();
      }
      grid[y].pop();
    });
  }
}

function findMaxSizes(input: Input) {
  return [
    input.dots.reduce((max, dot) => (dot.x > max ? dot.x : max), 0),
    input.dots.reduce((max, dot) => (dot.y > max ? dot.y : max), 0)
  ];
}

function createGrid(input: Input): Grid {
  const [x, y] = findMaxSizes(input);
  let grid = new Array(y + 1).fill(null).map(() => new Array(x + 1).fill(null).map(() => 0));
  input.dots.forEach(dot => (grid[dot.y][dot.x] = 1));
  return grid;
}

function parseInput(input: string[]) {
  const index = input.findIndex(each => each === '');
  return {
    dots: input.slice(0, index).map(dot => ({ x: parseInt(dot.split(',')[0]), y: parseInt(dot.split(',')[1]) })),
    folds: input.slice(index + 1, input.length).map(fold => fold.slice(11))
  };
}

function print(grid: Grid) {
  grid.forEach(row => console.log(row.map(x => (x === 1 ? '#' : ' ')).join('')));
}

// prettier-ignore
function letter(letter: Grid) {
  const letters: Map<string, string> = new Map();
  const serialize = grid => JSON.stringify(grid);

  letters.set(serialize([[0, 1, 1, 0], [1, 0, 0, 1], [1, 0, 0, 1], [1, 1, 1, 1], [1, 0, 0, 1], [1, 0, 0, 1]]), 'A');
  letters.set(serialize([[1, 1, 1, 0], [1, 0, 0, 1], [1, 1, 1, 0], [1, 0, 0, 1], [1, 0, 0, 1], [1, 1, 1, 0]]), 'B');
  letters.set(serialize([[0, 1, 1, 0], [1, 0, 0, 1], [1, 0, 0, 0], [1, 0, 0, 0], [1, 0, 0, 1], [0, 1, 1, 0]]), 'C');
  letters.set(serialize([[1, 1, 1, 1], [1, 0, 0, 0], [1, 1, 1, 0], [1, 0, 0, 0], [1, 0, 0, 0], [1, 1, 1, 1]]), 'E');
  letters.set(serialize([[1, 1, 1, 1], [1, 0, 0, 0], [1, 1, 1, 0], [1, 0, 0, 0], [1, 0, 0, 0], [1, 0, 0, 0]]), 'F');
  letters.set(serialize([[0, 1, 1, 0], [1, 0, 0, 1], [1, 0, 0, 0], [1, 0, 1, 1], [1, 0, 0, 1], [0, 1, 1, 1]]), 'G');
  letters.set(serialize([[1, 0, 0, 1], [1, 0, 0, 1], [1, 1, 1, 1], [1, 0, 0, 1], [1, 0, 0, 1], [1, 0, 0, 1]]), 'H');
  letters.set(serialize([[0, 0, 1, 1], [0, 0, 0, 1], [0, 0, 0, 1], [0, 0, 0, 1], [1, 0, 0, 1], [0, 1, 1, 0]]), 'J');
  letters.set(serialize([[1, 0, 0, 1], [1, 0, 1, 0], [1, 1, 0, 0], [1, 0, 1, 0], [1, 0, 1, 0], [1, 0, 0, 1]]), 'K');
  letters.set(serialize([[1, 0, 0, 0], [1, 0, 0, 0], [1, 0, 0, 0], [1, 0, 0, 0], [1, 0, 0, 0], [1, 1, 1, 1]]), 'L');
  letters.set(serialize([[1, 1, 1, 1, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 1, 1, 1, 1]]), 'O');
  letters.set(serialize([[1, 1, 1, 0], [1, 0, 0, 1], [1, 0, 0, 1], [1, 1, 1, 0], [1, 0, 0, 0], [1, 0, 0, 0]]), 'P');
  letters.set(serialize([[1, 1, 1, 0], [1, 0, 0, 1], [1, 0, 0, 1], [1, 1, 1, 0], [1, 0, 1, 0], [1, 0, 0, 1]]), 'R');
  letters.set(serialize([[1, 0, 0, 1], [1, 0, 0, 1], [1, 0, 0, 1], [1, 0, 0, 1], [1, 0, 0, 1], [0, 1, 1, 0]]), 'U');
  letters.set(serialize([[1, 1, 1, 1], [0, 0, 0, 1], [0, 0, 1, 0], [0, 1, 0, 0], [1, 0, 0, 0], [1, 1, 1, 1]]), 'Z');
  
  return letters.get(serialize(letter));
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
  const sample = `6,10
0,14
9,10
0,3
10,4
4,11
6,0
6,12
4,1
0,13
10,12
3,4
3,0
8,4
1,10
2,14
8,10
9,0

fold along y=7
fold along x=5`.split('\n');

  afterEach(() => jest.restoreAllMocks());

  test('part1', () => {
    const logSpy = mockLog();
    part1(parseInput(sample));
    expect(logSpy).toBeCalledWith(17);
  });

  test('part2', () => {
    const logSpy = mockLog();
    part2(parseInput(sample));
    expect(logSpy).toBeCalledWith('O');
  });
}
