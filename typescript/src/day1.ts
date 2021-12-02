import readInput from './readInput';

const input = readInput('1').map(x => parseInt(x));

const reduce = depths =>
  depths.reduce((acc, depth, index, array) => {
    // console.log({ depth }, { index }, Number(depth > array[index - 1]));
    acc += Number(depth > array[index - 1]);
    return acc;
  }, 0);

if (process.argv[2] == '1') {
  const solution = reduce(input);

  console.log(solution);
}

if (process.argv[2] == '2') {
  const threeSums = input
    .map((depth, index, array) => {
      // console.log({ depth }, { index }, depth + array[index + 1] + array[index + 2]);
      if (index + 2 < array.length - 1) return depth + array[index + 1] + array[index + 2];
    })
    .filter(x => x);

  // console.log(threeSums);

  const solution = reduce(threeSums);

  console.log(solution);
}
