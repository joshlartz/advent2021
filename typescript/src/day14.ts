import { readInput, day, mockLog } from './helpers';

type Input = { polymer: string; pairs: { pair: string; insert: string }[] };
type Pairs = { [key: string]: number };

function part1(input: Input) {
  const letters = insertions(10, input, initialPairs(input.polymer), frequency(input.polymer.split('')));

  console.log(Math.max(...Object.values(letters)) - Math.min(...Object.values(letters)));
}

function part2(input: Input) {
  const letters = insertions(40, input, initialPairs(input.polymer), frequency(input.polymer.split('')));

  console.log(Math.max(...Object.values(letters)) - Math.min(...Object.values(letters)));
}

function insertions(size: number, input: Input, pairs: Pairs, letters: Pairs) {
  for (let s = 0; s < size; s++) {
    let newPairs = Object.assign({}, pairs);

    input.pairs.forEach(each => {
      if ((pairs[each.pair] ?? 0) > 0) {
        const leftPair = each.pair[0] + each.insert;
        const rightPair = each.insert + each.pair[1];
        newPairs[leftPair] = (newPairs[leftPair] || 0) + (pairs[each.pair] || 1);
        newPairs[rightPair] = (newPairs[rightPair] || 0) + (pairs[each.pair] || 1);
        newPairs[each.pair] -= pairs[each.pair];
        letters[each.insert] = (letters[each.insert] || 0) + (pairs[each.pair] || 1);
      }
    });
    pairs = newPairs;
  }
  return letters;
}

function parseInput(input: string[]): Input {
  return {
    polymer: input[0],
    pairs: input.slice(2, input.length).map(pair => ({ pair: pair.split(' -> ')[0], insert: pair.split(' -> ')[1] }))
  };
}

function frequency(array: string[]): { [key: string]: number } {
  return array.reduce((acc, letter) => {
    acc[letter] = (acc[letter] || 0) + 1;
    return acc;
  }, {});
}

function initialPairs(polymer: string) {
  return frequency(
    polymer.split('').reduce((acc, _, index) => {
      if (index < polymer.length - 1) acc.push(polymer[index] + polymer[index + 1]);
      return acc;
    }, [])
  );
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
  const sample = `NNCB

CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C`.split('\n');

  afterEach(() => jest.restoreAllMocks());

  test('part1', () => {
    const logSpy = mockLog();
    part1(parseInput(sample));
    expect(logSpy).toBeCalledWith(1588);
  });

  test('part2', () => {
    const logSpy = mockLog();
    part2(parseInput(sample));
    expect(logSpy).toBeCalledWith(2188189693529);
  });
}
