import { readInput, day, mockLog } from './helpers';

type Input = string[];
type Target = { xMin: number; xMax: number; yMin: number; yMax: number };
type Coord = { x: number; y: number };

function part1(target: Target) {
  console.log(target.yMin * (target.yMin + 1) / 2);
}

function part2(target: Target) {
  const xBound = Math.abs(Math.abs(target.xMax) > Math.abs(target.xMin) ? target.xMax : target.xMin);
  const yBound = Math.abs(Math.abs(target.yMax) > Math.abs(target.yMin) ? target.yMax : target.yMin);

  const validCoords: Coord[] = [];
  for (let x = -1 * xBound * 2; x < xBound * 2; x++) {
    for (let y = -1 * yBound * 2; y < yBound * 2; y++) {
      let position: Coord = { x: 0, y: 0 };
      let velocity: Coord = { x, y };
      for (let step = 1; step <= 1000; step++) {
        doStep(velocity, position);
        if (withinTarget(target, position)) validCoords.push({ x, y });
      }
    }
  }
  const dedupe = validCoords.map(c => JSON.stringify(c));
  console.log(dedupe.filter((c, i) => dedupe.indexOf(c) === i).length);
}

function withinTarget(target: Target, position: Coord) {
  return (
    position.x >= target.xMin && position.x <= target.xMax && position.y >= target.yMin && position.y <= target.yMax
  );
}

function doStep(velocity: Coord, position: Coord) {
  position.x += velocity.x;
  position.y += velocity.y;
  velocity.x += direction(velocity.x);
  velocity.y -= 1;

  return { velocity, position };
}

function direction(coord: number) {
  if (coord === 0) return coord;
  if (coord > 0) return -1;
  if (coord < 0) return 1;
}

function parseInput(input: Input): Target {
  const [xRange, yRange] = input[0]
    .slice(13)
    .split(', ')
    .map(x => x.slice(2));
  // weird NaN parsing was happening with map
  const [xMin, xMax] = xRange.split('..'); //.map(parseInt);
  const [yMin, yMax] = yRange.split('..'); //.map(parseInt);
  return { xMin: parseInt(xMin), xMax: parseInt(xMax), yMin: parseInt(yMin), yMax: parseInt(yMax) };
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
  const sample = `target area: x=20..30, y=-10..-5`.split('\n');

  afterEach(() => jest.restoreAllMocks());

  test('part1', () => {
    const logSpy = mockLog();
    part1(parseInput(sample));
    expect(logSpy).toBeCalledWith(45);
  });

  test('part2', () => {
    const logSpy = mockLog();
    part2(parseInput(sample));
    expect(logSpy).toBeCalledWith(112);
  });
}
