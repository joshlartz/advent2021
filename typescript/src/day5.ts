import readInput from './readInput';
import { mockLog } from './tests';

function part1(input) {
  const lines = parseInput(input);
  const grid = createGrid(input);

  lines.forEach(line => {
    if (line[0].x == line[1].x || line[0].y == line[1].y) {
      if (line[0].y == line[1].y) {
        const [start, end] = line[0].x < line[1].x ? [line[0], line[1]] : [line[1], line[0]];
        for (let x = start.x; x <= end.x; x++) {
          grid[start.y][x]++;
        }
      }
      if (line[0].x == line[1].x) {
        const [start, end] = line[0].y < line[1].y ? [line[0], line[1]] : [line[1], line[0]];
        for (let y = start.y; y <= end.y; y++) {
          grid[y][start.x]++;
        }
      }
    }
  });

  // console.log(grid);
  console.log(findOverlaps(grid));
}

function part2(input: string[]) {
  const lines = parseInput(input);
  const grid = createGrid(input);

  lines.forEach(line => {
    if (line[0].y == line[1].y) {
      const [start, end] = line[0].x < line[1].x ? [line[0], line[1]] : [line[1], line[0]];
      for (let x = start.x; x <= end.x; x++) {
        grid[start.y][x]++;
      }
    } else if (line[0].x == line[1].x) {
      const [start, end] = line[0].y < line[1].y ? [line[0], line[1]] : [line[1], line[0]];
      for (let y = start.y; y <= end.y; y++) {
        grid[y][start.x]++;
      }
    } else {
      let x = line[0].x;
      let y = line[0].y;
      const xDirection = x < line[1].x ? 1 : -1;
      const yDirection = y < line[1].y ? 1 : -1;
      // 45 degrees so either axis can be used
      const length = Math.abs(line[0].x - line[1].x);

      for (let i = 0; i <= length; i++) {
        grid[y + i * yDirection][x + i * xDirection]++;
      }
    }
  });

  // console.log(grid);
  console.log(findOverlaps(grid));
}

// x1,y1 -> x2,y2
function parseInput(input) {
  return input
    .filter(x => x)
    .map(line => {
      const coords = line.split(' ');
      return [
        { x: parseInt(coords[0].split(',')[0]), y: parseInt(coords[0].split(',')[1]) },
        { x: parseInt(coords[2].split(',')[0]), y: parseInt(coords[2].split(',')[1]) }
      ];
    });
}

function findMaxSize(input) {
  return input
    .flatMap((line: string) =>
      line
        .replace(' -> ', ',')
        .split(',')
        .map(num => parseInt(num))
    )
    .reduce((max, num) => (num > max ? num : max), 0);
}

function createGrid(input) {
  const size = findMaxSize(input) + 1;
  return new Array(size).fill(null).map(() => new Array(size).fill(null).map(() => 0));
}

function findOverlaps(grid) {
  return grid.flat().reduce((acc, num) => {
    if (num >= 2) acc++;
    return acc;
  }, 0);
}

if (require.main === module) {
  const input = readInput('5');

  if (process.argv[2] == '1') part1(input);
  if (process.argv[2] == '2') part2(input);
} else {
  const sample = `0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2`.split('\n');

  test('part1', () => {
    const logSpy = mockLog();
    part1(sample);
    expect(logSpy).toBeCalledWith(5);
  });

  test('part2', () => {
    const logSpy = mockLog();
    part2(sample);
    expect(logSpy).toBeCalledWith(12);
  });
}
