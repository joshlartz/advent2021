import { readInput, day, mockLog } from './helpers';

type Input = { algorithm: string; image: string[][] };

function part1(input: Input) {
  let startingImage = JSON.parse(JSON.stringify(input.image));
  // print(startingImage);
  // console.log();

  let newImage = enhance(startingImage, input.algorithm, 1);
  // print(newImage);
  // console.log();

  startingImage = newImage;
  newImage = enhance(startingImage, input.algorithm, 2);
  // print(newImage);

  console.log(count(newImage));
}

function part2(input) {
  let startingImage = JSON.parse(JSON.stringify(input.image));
  let newImage: string[][];

  for (let i=1; i <= 50; i++) {
    newImage = enhance(startingImage, input.algorithm, i);
    startingImage = newImage;
  }

  console.log(count(newImage));
}

function enhance(startingImage, algorithm, iteration) {
  pad(startingImage, algorithm, iteration);
  let newImage = JSON.parse(JSON.stringify(startingImage));

  for (let y = 0; y < startingImage.length; y++) {
    for (let x = 0; x < startingImage[y].length; x++) {
      newImage[y][x] = convert(y, x, startingImage, algorithm, iteration);
    }
  }

  return newImage;
}

function convert(y: number, x: number, image: string[][], algorithm: string, iteration) {
  const endPixel = (parseInt(algorithm[0]) * (1 - iteration % 2)).toString();
  function neighbor(y: number, x: number) {
    try {
      return image[y][x] ?? endPixel;
    } catch (err) {
      return endPixel;
    }
  }

  let pixel =
    neighbor(y - 1, x - 1) +
    neighbor(y - 1, x) +
    neighbor(y - 1, x + 1) +
    neighbor(y, x - 1) +
    neighbor(y, x) +
    neighbor(y, x + 1) +
    neighbor(y + 1, x - 1) +
    neighbor(y + 1, x) +
    neighbor(y + 1, x + 1);

  return algorithm[parseInt(pixel, 2)];
}

/** add 3 dark pixes around the borders */
function pad(image: string[][], algorithm: string, iteration: number) {
  const pixel = algorithm[0] == '1' ? (1 - iteration % 2).toString() : '0';
  const maxX = image[0].length;

  // top
  for (let i = 0; i < 3; i++) {
    image.unshift(new Array(maxX).fill(null).map(() => pixel));
  }
  // bottom
  for (let i = 0; i < 3; i++) {
    image.push(new Array(maxX).fill(null).map(() => pixel));
  }
  // sides
  for (let i = 0; i < image.length; i++) {
    image[i].unshift(pixel, pixel, pixel);
    image[i].push(pixel, pixel, pixel);
  }
}

function count(image: string[][]): number {
  return image.reduce((acc, row) => acc + row.reduce((a, pixel) => a + parseInt(pixel), 0), 0)
}

function print(input) {
  input.forEach(line => console.log(line.join('').replaceAll('1', '#').replaceAll('0', '.')));
}

function parseInput(input: string[]): Input {
  const convert = (line: string) => line.replaceAll('#', '1').replaceAll('.', '0');
  return { algorithm: convert(input[0]), image: input.slice(2, input.length - 1).map(line => convert(line).split('')) };
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
  const sample =
    `..#.#..#####.#.#.#.###.##.....###.##.#..###.####..#####..#....#..#..##..###..######.###...####..#..#####..##..#.#####...##.#.#..#.##..#.#......#.###.######.###.####...#.##.##..#..#..#####.....#.#....###..#.##......#.....#..#..#..##..#...##.######.####.####.#.#...#.......#..#.#.#...####.##.#......#..#...##.#.##..#...##.#.##..###.#......#.#.......#.#.#.####.###.##...#.....####.#..#..#.##.#....##..#.####....##...##..#...#......#.#.......#.......##..####..#...#.#.#...##..#.#..###..#####........#..####......#..#

#..#.
#....
##..#
..#..
..###
`.split('\n');

  afterEach(() => jest.restoreAllMocks());

  test('part1 sample1', () => {
    const logSpy = mockLog();
    part1(parseInput(sample));
    expect(logSpy).toBeCalledWith(35);
  });

  test('part2', () => {
    const logSpy = mockLog();
    part2(parseInput(sample));
    expect(logSpy).toBeCalledWith(3351);
  });
}
