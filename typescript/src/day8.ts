import { readInput, day, mockLog } from './helpers';

function part1([signals, outputs]: string[][][]) {
  let outputCounts = Array(10).fill(0);
  outputs.forEach(display => {
    display.forEach(digit => {
      outputCounts[findEasyNumber(digit)]++;
    });
  });
  console.log(outputCounts.reduce((acc, num) => acc + num, 0));
}

function part2([signals, outputs]: string[][][]) {
  let outputNumbers: number[] = [];
  signals.forEach((display, index) => {
    const numbers = {};
    const segments = {};
    display.forEach(digit => {
      if (findEasyNumber(digit)) numbers[findEasyNumber(digit)] = digit;
    });

    segments['a'] = numbers['7'].replace(intersection(numbers['7'], numbers['1']), '');

    let sixes = display.filter(digit => digit.length === 6);
    numbers['6'] = sixes.find(digit => !contains(digit, numbers['1']));
    segments['c'] = findMissing(numbers['6'])[0];

    sixes = sixes.filter(digit => numbers['6'] !== digit);
    numbers['0'] = sixes.find(digit => !contains(digit, numbers['4']));
    segments['d'] = findMissing(numbers['0'])[0];

    numbers['9'] = sixes.find(digit => numbers['0'] !== digit);
    segments['e'] = findMissing(numbers['9'])[0];

    let fives = display.filter(digit => digit.length === 5);
    numbers['5'] = fives.find(
      digit => findMissing(digit).includes(segments['c']) && findMissing(digit).includes(segments['e'])
    );

    fives = fives.filter(digit => numbers['5'] !== digit);
    numbers['3'] = fives.find(digit => findMissing(digit).includes(segments['e']));

    numbers['2'] = fives.find(digit => numbers['3'] !== digit);

    outputNumbers.push(parseInt(translate(outputs[index], numbers)));
  });

  console.log(outputNumbers.reduce((acc, num) => acc + num, 0));
}

function findEasyNumber(segments) {
  switch (segments.length) {
    case 2:
      return 1;
    case 4:
      return 4;
    case 3:
      return 7;
    case 7:
      return 8;
  }
}

function intersection(seg1: string, seg2: string): string {
  return seg1
    .split('')
    .filter(char => seg2.split('').includes(char))
    .join('');
}

function findMissing(seg: string): string[] {
  return ['a', 'b', 'c', 'd', 'e', 'f', 'g'].filter(letter => !seg.includes(letter));
}

function contains(seg1: string, seg2: string) {
  return seg2.split('').every(char => seg1.split('').includes(char));
}

function translate(output: string[], numbers) {
  return output
    .map(digit =>
      Object.values(numbers).findIndex((value: string) => contains(value, digit) && value.length === digit.length)
    )
    .join('');
}

function parseInput(input: string[]) {
  let signals = input.map(line => line.split(' | ')[0]).filter(x => x).map(line => line.split(' '));
  let outputs = input.map(line => line.split(' | ')[1]).filter(x => x).map(line => line.split(' '));
  return [signals, outputs];
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
  const sample1 = `acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab | cdfeb fcadb cdfeb cdbaf`.split('\n');

  const sample2 = `be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce`.split('\n');

  afterEach(() => jest.restoreAllMocks());

  test('part1 sample1', () => {
    const logSpy = mockLog();
    part1(parseInput(sample1));
    expect(logSpy).toBeCalledWith(0);
  });

  test('part1 sample2', () => {
    const logSpy = mockLog();
    part1(parseInput(sample2));
    expect(logSpy).toBeCalledWith(26);
  });

  test('part2 sample1', () => {
    const logSpy = mockLog();
    part2(parseInput(sample1));
    expect(logSpy).toBeCalledWith(5353);
  });

  test('part2 sample2', () => {
    const logSpy = mockLog();
    part2(parseInput(sample2));
    expect(logSpy).toBeCalledWith(61229);
  });
}
