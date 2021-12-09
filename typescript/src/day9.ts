import { readInput, day, mockLog } from './helpers';

type Coord = { row: number; col: number };

function part1(input: string[]) {
  console.log(findLowest(input).lowest.reduce((acc, num) => acc + num + 1, 0));
}

function part2(input: string[]) {
  let basins = [];
  let explored = new Array(input.length).fill(null).map(() => new Array(input[0].length).fill(null).map(() => 0));

  function explore(coord, input, basin = 1) {
    explored[coord.row][coord.col] = 1;
    const rowEnd = input.length - 1;
    const colEnd = input[0].length - 1;
    
    // above
    if (coord.row > 0)
      for (let row = coord.row - 1; row >= 0; row--) {
        if (parseInt(input[row][coord.col]) < 9 && explored[row][coord.col] == 0) {
          explored[row][coord.col] = 1;
          basin = 1 + explore({ row, col: coord.col }, input, basin);
        } else break;
      }
    // below
    if (coord.row < rowEnd)
      for (let row = coord.row + 1; row <= rowEnd; row++) {
        if (parseInt(input[row][coord.col]) < 9 && explored[row][coord.col] == 0) {
          explored[row][coord.col] = 1;
          basin = 1 + explore({ row, col: coord.col }, input, basin);
        } else break;
      }
    // left
    if (coord.col > 0)
      for (let col = coord.col - 1; col >= 0; col--) {
        if (parseInt(input[coord.row][col]) < 9 && explored[coord.row][col] == 0) {
          explored[coord.row][col] = 1;
          basin = 1 + explore({ row: coord.row, col }, input, basin);
        } else break;
      }
    // right
    if (coord.col < colEnd)
      for (let col = coord.col + 1; col <= colEnd; col++) {
        if (parseInt(input[coord.row][col]) < 9 && explored[coord.row][col] == 0) {
          explored[coord.row][col] = 1;
          basin = 1 + explore({ row: coord.row, col }, input, basin);
        } else break;
      }
  
    return basin;
  }

  findLowest(input).coords.forEach(coord => basins.push(explore(coord, input)));
  // print(explored);
  basins.sort((a, b) => b - a);
  console.log(basins.slice(0, 3).reduce((acc, num) => acc * num, 1));
}

function findLowest(input) {
  let lowest: number[] = [];
  let coords: Coord[] = [];
  for (let row = 0; row < input.length; row++) {
    for (let col = 0; col < input[0].length; col++) {
      const cell = input[row][col];
      if (
        cell < (row == 0 ? 10 : input[row - 1][col]) && // above
        cell < (row == input.length - 1 ? 10 : input[row + 1][col]) && // below
        cell < (col == 0 ? 10 : input[row][col - 1]) && // left
        cell < (col == input[0].length - 1 ? 10 : input[row][col + 1]) // right
      ) {
        lowest.push(parseInt(cell));
        coords.push({ row, col });
      }
    }
  }
  return { lowest, coords };
}

function print(grid) {
  grid.forEach(line => console.log(line.join('')));
}

if (require.main === module) {
  const input = readInput(day(__filename));

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
  const sample = `2199943210
3987894921
9856789892
8767896789
9899965678`.split('\n');

  afterEach(() => jest.restoreAllMocks());

  test('part1', () => {
    const logSpy = mockLog();
    part1(sample);
    expect(logSpy).toBeCalledWith(15);
  });

  test('part2 sample2', () => {
    const logSpy = mockLog();
    part2(sample);
    expect(logSpy).toBeCalledWith(1134);
  });
}
