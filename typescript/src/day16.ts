import { readInput, day, mockLog } from './helpers';

const LOG = false;

type State = { input: string, versions: number, log: boolean, index: number, length: number };
type Props = { subpacket?: boolean, count?: number; };

function part1(input: string) {
  const state = { input, versions: 0, log: LOG, index: 0, length: input.length };
  if (state.log) console.log(input);
  parsePackets(input, state, { subpacket: false, count: Infinity });
  console.log(state.versions);
}

function part2(input) {}

function parsePackets(input: string, state: State, props: Props) {
  if (state.log) console.log('subpacketCount:', props.count);
  // stop when the number of subpackets has been reached
  if (props.count <= 0) return parsePackets(input, state, { ...props, subpacket: true, count: Infinity });

  const version = parseInt(input.slice(0, 3), 2);
  state.versions += version;
  const typeId = parseInt(input.slice(3, 6), 2);
  state.index += 6;

  if (typeId === 4) {
    let rawData = chunkArray(input.slice(6).split(''), 5).map(bits => bits.join(''));
    if (rawData.slice(-1).length < 5 && !props.subpacket) rawData.pop();
    if (state.log) console.log('rawData:', rawData, 'index:', state.index);

    let bits = [];
    for (let i = 0; i < rawData.length; i++) {
      bits.push(rawData[i]);
      state.index += 5;
      if (rawData[i][0] == 0) {
        rawData.splice(0, i + 1);
        break;
      }
    }
    if (state.log) console.log('bits:', bits, 'index:', state.index, 'rawData:', rawData);
    let data = parseInt(
      bits.reduce((acc, b) => acc + b.slice(1, 5), ''),
      2
    );

    if (state.log) console.log('version:', version, 'typeId:', typeId, 'index:', state.index, 'data:', data, '\n');

    if (rawData.join('').length >= 11)
      parsePackets(rawData.join(''), state, { ...props, subpacket: true, count: props.count - 1 });
  } else {
    const lengthTypeId = parseInt(input.slice(6, 7), 2);
    state.index += 1;

    if (state.log)
      console.log('version:', version, 'typeId:', typeId, 'lengthType:', lengthTypeId, 'index:', state.index);

    if (lengthTypeId === 0) {
      const bitsLength = parseInt(input.slice(7, 22), 2);
      state.index += 15;
      const packets = input.slice(22, 22 + bitsLength);
      if (state.log) console.log('bitsLength:', bitsLength, 'index:', state.index, 'packets:', packets, '\n');
      parsePackets(packets, state, { ...props, subpacket: true, count: props.count - 1 });
    } else {
      const subPackets = parseInt(input.slice(7, 18), 2);
      state.index += 11;
      if (state.log) console.log('subPackets:', subPackets, '\n');
      parsePackets(input.slice(18), state, { ...props, subpacket: true, count: subPackets });
    }
  }
  if (state.length - state.index >= 11)
    parsePackets(state.input.slice(state.index), state, { ...props, subpacket: true, count: props.count - 1 }); 
}

function chunkArray(array, size) {
  let newArray = [];
  for (let i = 0; i < array.length; i += size) {
    newArray.push(array.slice(i, i + size));
  }
  return newArray;
}

function parseInput(input: string) {
  const convert = {
    '0': '0000',
    '1': '0001',
    '2': '0010',
    '3': '0011',
    '4': '0100',
    '5': '0101',
    '6': '0110',
    '7': '0111',
    '8': '1000',
    '9': '1001',
    A: '1010',
    B: '1011',
    C: '1100',
    D: '1101',
    E: '1110',
    F: '1111'
  };
  return input
    .split('')
    .map(hex => convert[hex])
    .join('');
}

if (require.main === module) {
  const input = parseInput(readInput(day(__filename))[0]);

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
  const simple1 = 'D2FE28';
  const simple2 = '38006F45291200';
  const simple3 = 'EE00D40C823060';
  const sample1 = '8A004A801A8002F478';
  const sample2 = '620080001611562C8802118E34';
  const sample3 = 'C0015000016115A2E0802F182340';
  const sample4 = 'A0016C880162017C3686B18A3D4780';

  afterEach(() => jest.restoreAllMocks());

  test('part1 simple1', () => {
    const logSpy = mockLog();
    part1(parseInput(simple1));
    expect(logSpy).toBeCalledWith(6);
  });
  test('part1 simple2', () => {
    const logSpy = mockLog();
    part1(parseInput(simple2));
    expect(logSpy).toBeCalledWith(9);
  });
  test('part1 simple3', () => {
    const logSpy = mockLog();
    part1(parseInput(simple3));
    expect(logSpy).toBeCalledWith(14);
  });

  test('part1 sample1', () => {
    const logSpy = mockLog();
    part1(parseInput(sample1));
    expect(logSpy).toBeCalledWith(16);
  });
  test('part1 sample2', () => {
    const logSpy = mockLog();
    part1(parseInput(sample2));
    expect(logSpy).toBeCalledWith(12);
  });
  test('part1 sample3', () => {
    const logSpy = mockLog();
    part1(parseInput(sample3));
    expect(logSpy).toBeCalledWith(23);
  });
  test('part1 sample4', () => {
    const logSpy = mockLog();
    part1(parseInput(sample4));
    expect(logSpy).toBeCalledWith(31);
  });

  // test('part2', () => {
  //   const logSpy = mockLog();
  //   part2(sample);
  //   expect(logSpy).toBeCalledWith(315);
  // });
}
