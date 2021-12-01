import readInput from './readInput';

const input = readInput('1');

const solution = input.reduce((acc, depth, index, array) => {
  // console.log({ depth }, { index }, (depth > array[index-1]) ? 1 : 0);
  acc += (depth > array[index-1]) ? 1 : 0;
  return acc;
}, 0);

// not sure why
console.log(solution + 1);
