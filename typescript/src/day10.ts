import { readInput, day, mockLog } from './helpers';

const brackets = { '(': ')', '[': ']', '{': '}', '<': '>' };
const corruptScores = { ')': 3, ']': 57, '}': 1197, '>': 25137 };
const incompleteScores = { ')': 1, ']': 2, '}': 3, '>': 4 };

const isOpen = (char: string) => Boolean(char.match(/\(|\[|\{|\</));
const isClose = (char: string) => Boolean(char.match(/\)|\]|\}|\>/));

function part1(input: string[]) {
  console.log(findCorrupt(Array.from(input)).found.reduce((acc, each) => acc + corruptScores[each], 0));
}

function part2(input: string[]) {
  let lines = Array.from(input);
  findCorrupt(lines)
    .indexes.reverse()
    .forEach(index => lines.splice(index, 1));

  let closing = lines.map(line =>
    line
      .split('')
      .reverse()
      .map(char => brackets[char])
      .reduce((acc, char) => acc * 5 + incompleteScores[char], 0)
  );
  closing.sort((a, b) => a - b);
  console.log(findMedian(closing));
}

function findCorrupt(input: string[]) {
  let found: string[] = [];
  let indexes: number[] = [];

  input.forEach((line, index, array) => {
    let length = line.length - 1;
    for (let i = 0; i < length; i++) {
      if (array[index][i + 1] === brackets[array[index][i]]) {
        array[index] = array[index].slice(0, i) + array[index].slice(i + 2);
        i = -1;
        length -= 2;
      } else if (isClose(array[index][i]))
        if (isOpen(array[index][i - 1])) {
          found.push(array[index][i]);
          indexes.push(index);
          break;
        }
    }
  });
  return { found, indexes };
}

function findMedian(arr) {
  const mid = Math.floor(arr.length / 2);
  return arr.length % 2 !== 0 ? arr[mid] : (arr[mid - 1] + arr[mid]) / 2;
}

if (require.main === module) {
  const input = readInput(day(__filename)).filter(x => x);

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
  const sample = `[({(<(())[]>[[{[]{<()<>>
[(()[<>])]({[<{<<[]>>(
{([(<{}[<>[]}>{[]{[(<()>
(((({<>}<{<{<>}{[]{[]{}
[[<[([]))<([[{}[[()]]]
[{[{({}]{}}([{[{{{}}([]
{<[[]]>}<{[{[{[]{()[[[]
[<(<(<(<{}))><([]([]()
<{([([[(<>()){}]>(<<{{
<{([{{}}[<[[[<>{}]]]>[]]`.split('\n');

  afterEach(() => jest.restoreAllMocks());

  test('part1', () => {
    const logSpy = mockLog();
    part1(sample);
    expect(logSpy).toBeCalledWith(26397);
  });

  test('part2 sample2', () => {
    const logSpy = mockLog();
    part2(sample);
    expect(logSpy).toBeCalledWith(288957);
  });
}
