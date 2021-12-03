import readInput from './readInput';

const input = readInput('3').map(binary => binary.split('').map(char => parseInt(char)));

if (process.argv[2] == '1') {
  const columnCounts = new Array(input[0].length).fill(undefined).map(x => ({ zero: 0, one: 0 }));

  for (let i = 0; i < input[0].length; i++) {
    input.forEach(num => {
      if (num[i]) columnCounts[i].one++;
      else columnCounts[i].zero++;
    });
  }

  // most common
  const gamma = columnCounts.map(counts => counts.zero > counts.one ? '0' : '1' ).join('')
  // least common
  const epsilon = columnCounts.map(counts => counts.zero < counts.one ? '0' : '1' ).join('');

  console.log(parseInt(gamma, 2) * parseInt(epsilon, 2));
}

if (process.argv[2] == '2') {
}
