import { cp } from 'fs';
import readInput from './readInput';

const input = readInput('2')

if (process.argv[2] == '1') {
  let depth = 0;
  let horizontal = 0;

  input.forEach(command => {
    const direction = command.split(' ');
    if (direction[0] == 'forward') horizontal += parseInt(direction[1])
    if (direction[0] == 'down') depth += parseInt(direction[1])
    if (direction[0] == 'up') depth -= parseInt(direction[1])
  })

  console.log(horizontal * depth);
}

if (process.argv[2] == '2') {
  let depth = 0;
  let horizontal = 0;
  let aim = 0;

  input.forEach(command => {
    const direction = command.split(' ');
    if (direction[0] == 'forward') {
      horizontal += parseInt(direction[1]);
      depth += aim * parseInt(direction[1]);
    }
    if (direction[0] == 'down') aim += parseInt(direction[1])
    if (direction[0] == 'up') aim -= parseInt(direction[1])
  })

  console.log(horizontal * depth);
}
