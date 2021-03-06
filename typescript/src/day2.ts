import { readInput, day, mockLog } from './helpers';

function part1(input) {
  let depth = 0;
  let horizontal = 0;

  input.forEach(command => {
    const direction = command.split(' ');
    if (direction[0] == 'forward') horizontal += parseInt(direction[1]);
    if (direction[0] == 'down') depth += parseInt(direction[1]);
    if (direction[0] == 'up') depth -= parseInt(direction[1]);
  });

  console.log(horizontal * depth);
}

function part2(input) {
  let depth = 0;
  let horizontal = 0;
  let aim = 0;

  input.forEach(command => {
    const direction = command.split(' ');
    if (direction[0] == 'forward') {
      horizontal += parseInt(direction[1]);
      depth += aim * parseInt(direction[1]);
    }
    if (direction[0] == 'down') aim += parseInt(direction[1]);
    if (direction[0] == 'up') aim -= parseInt(direction[1]);
  });

  console.log(horizontal * depth);
}

if (require.main === module) {
  const input = readInput(day(__filename));

  if (process.argv[2] == '1') part1(input);
  else if (process.argv[2] == '2') part2(input);
  else {
    console.log(`day ${day(__filename)}`);
    console.time('part1');
    part1(input);
    console.timeEnd('part1');
    console.time('part2');
    part2(input);
    console.timeEnd('part2');
  }
} else {
  const sample = `forward 5
down 5
forward 8
up 3
down 8
forward 2`.split('\n');

  test('part1', () => {
    const logSpy = mockLog();
    part1(sample);
    expect(logSpy).toBeCalledWith(150);
  });

  test('part2', () => {
    const logSpy = mockLog();
    part2(sample);
    expect(logSpy).toBeCalledWith(900);
  });
}
