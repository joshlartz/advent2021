import { readInput, day, mockLog } from './helpers';

type Caves = { [key: string]: Set<string> };
const smallCave = cave => Boolean(cave.match(/[a-z]+/));
const bigCave = cave => Boolean(cave.match(/[A-Z]+/));

function part1(input: string[]) {
  const caves = mapConnected(input);

  let routes = [];

  function travel(cave: string, route: string[] = []) {
    if ((smallCave(cave) && route.includes(cave)) || route.includes('end')) return route;
    route.push(cave);
    if (cave === 'end') {
      routes.push(route);
      return route;
    }
    [...caves[cave]].forEach(nextCave => travel(nextCave, Array.from(route)));
    return route;
  }

  [...caves['start']].forEach(cave => travel(cave, ['start']));

  // routes.forEach(route => console.log(route.join(',')));
  console.log(routes.length);
}

function part2(input: string[]) {
  const caves = mapConnected(input);

  let routes = [];

  function travel(cave: string, route: string[] = []) {
    if (route.includes('end')) return route;
    if (smallCave(cave) && twoSmall(route) && route.includes(cave)) return route;
    route.push(cave);
    if (cave === 'end') {
      routes.push(route);
      return route;
    }
    [...caves[cave]].forEach(nextCave => travel(nextCave, Array.from(route)));
    return route;
  }

  [...caves['start']].forEach(cave => travel(cave, ['start']));

  // routes.forEach(route => console.log(route.join(',')));
  console.log(routes.length);
}

function mapConnected(input: string[]) {
  const caves: Caves = {};

  input.forEach(each => {
    const [startCave, endCave] = each.split('-');
    caves[startCave] ? caves[startCave].add(endCave) : (caves[startCave] = new Set([endCave]));
    caves[endCave] ? caves[endCave].add(startCave) : (caves[endCave] = new Set([startCave]));

    // clean up start from potential paths
    Object.keys(caves).forEach(cave => {
      if (caves[cave].has('start')) caves[cave].delete('start');
    });
  });

  return caves;
}

function twoSmall(route: string[]) {
  const freq = route
    .filter(cave => smallCave(cave))
    .reduce((acc, cave) => {
      acc[cave] = (acc[cave] || 0) + 1;
      return acc;
    }, {});
  return Object.values(freq).filter(count => count > 1).length;
}

if (require.main === module) {
  const input = readInput(day(__filename));

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
  const sample1 = `start-A
start-b
A-c
A-b
b-d
A-end
b-end`.split('\n');

  const sample2 = `dc-end
HN-start
start-kj
dc-start
dc-HN
LN-dc
HN-end
kj-sa
kj-HN
kj-dc`.split('\n');

  const sample3 = `fs-end
he-DX
fs-he
start-DX
pj-DX
end-zg
zg-sl
zg-pj
pj-he
RW-he
fs-DX
pj-RW
zg-RW
start-pj
he-WI
zg-he
pj-fs
start-RW`.split('\n');

  afterEach(() => jest.restoreAllMocks());

  test('part1 sample1', () => {
    const logSpy = mockLog();
    part1(sample1);
    expect(logSpy).toBeCalledWith(10);
  });

  test('part1 sample2', () => {
    const logSpy = mockLog();
    part1(sample2);
    expect(logSpy).toBeCalledWith(19);
  });

  test('part1 sample3', () => {
    const logSpy = mockLog();
    part1(sample3);
    expect(logSpy).toBeCalledWith(226);
  });

  test('part2 sample1', () => {
    const logSpy = mockLog();
    part2(sample1);
    expect(logSpy).toBeCalledWith(36);
  });

  test('part2 sample2', () => {
    const logSpy = mockLog();
    part2(sample2);
    expect(logSpy).toBeCalledWith(103);
  });

  test('part2 sample3', () => {
    const logSpy = mockLog();
    part2(sample3);
    expect(logSpy).toBeCalledWith(3509);
  });
}
