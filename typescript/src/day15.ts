import { readInput, day, mockLog } from './helpers';
import { find_path } from 'dijkstrajs';

type Input = string[];
type Grid = number[][];
type Graph = { nodes: Set<string>, connections: Map<string, { [key: string]: number }> };
type Risks = Map<string, number>;

function part1(input: Grid) {
  let graph = createGraph(input);

  const startNode = JSON.stringify({ y: 0, x: 0 });
  const endNode = JSON.stringify({ y: input.length - 1, x: input[0].length - 1 });

  console.log(Dijkstra(graph, startNode, endNode));
}

function part2(input: Grid) {
  const blockSize = input.length;
  let biggerGrid = JSON.parse(JSON.stringify(input));

  // expand right
  for (let y = 0; y < blockSize; y++) {
    for (let i = 1; i < 5; i++) {
      for (let x = 0; x < blockSize; x++) {
        biggerGrid[y][x + i * blockSize] = increment(biggerGrid[y][x + (i - 1) * blockSize]);
      }
    }
  }

  // expand down
  for (let i = 1; i < 5; i++) {
    for (let y = 0; y < blockSize; y++) {
      biggerGrid[y + i * blockSize] = biggerGrid[y + (i - 1) * blockSize].map(x => increment(x));
    }
  }

  let graph = createGraph(biggerGrid);

  const startNode = JSON.stringify({ y: 0, x: 0 });
  const endNode = JSON.stringify({ y: biggerGrid.length - 1, x: biggerGrid[0].length - 1 });

  // TODO: why are you so slow 😭
  // console.log(Dijkstra(graph, startNode, endNode));
  const path = find_path(Object.fromEntries(graph.connections), startNode, endNode);
  console.log(path.reduce((acc, r) => acc + getRisk(r, biggerGrid), 0) - getRisk(startNode, biggerGrid));
}

function Dijkstra(graph: Graph, startNode, endNode) {
  let visited: Set<string> = new Set();
  let risks = new Map();
  let connectedNodes = new Map();

  graph.nodes.forEach(node => {
    risks.set(node, Infinity);
    connectedNodes.set(node, null);
  });
  risks.set(startNode, 0);

  let node = leastRiskyNode(risks, visited);

  while (node) {
    let connections = graph.connections.get(node);
    for (let connected in connections) {
      let risk = risks.get(node) + connections[connected];
      if (risks.get(connected) > risk) {
        risks.set(connected, risk);
        connectedNodes.set(connected, node);
      }
    }
    visited.add(node);
    node = leastRiskyNode(risks, visited);
  }

  // console.log(connectedNodes);
  // console.log(risks);
  // print(endNode, connectedNodes, input);
  return risks.get(endNode);
}

function leastRiskyNode(risks: Risks, visited: Set<string>): string {
  let leastRisk = Infinity;
  let leastNode: string = null;
  for (let node of risks.keys()) {
    let risk = risks.get(node);
    if (risk < leastRisk && !visited.has(node)) {
      leastRisk = risk;
      leastNode = node;
    }
  }
  return leastNode;
}

function createGraph(grid: Grid): Graph  {
  const graph = { nodes: new Set(), connections: new Map() };
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      const node = JSON.stringify({ y, x });
      graph.nodes.add(node);
      graph.connections.set(node, getConnected(y, x, grid));
    }
  }
  return graph as { nodes: Set<string>, connections: Map<string, { [key: string]: number }> };
}

function getConnected(y: number, x: number, grid: Grid): { [key: string]: number } {
  let connected = {};
  const down = { y: y + 1, x };
  const right = { y, x: x + 1 };
  const up = { y: y - 1, x };
  const left = { y, x: x - 1 };

  if (y < grid.length - 1) connected[JSON.stringify(down)] = grid[y + 1][x];
  if (x < grid[0].length - 1) connected[JSON.stringify(right)] = grid[y][x + 1];
  if (y > 0) connected[JSON.stringify(up)] = grid[y - 1][x];
  if (x > 0) connected[JSON.stringify(left)] = grid[y][x - 1];

  return connected;
}

function parseInput(input: Input) {
  return input.filter(x => x).map(y => y.split('').map(x => parseInt(x)));
}

function increment(number, add=1) {
  const newNum = number + add;
  return newNum > 9 ? newNum - 9 : newNum;
}

function print(endNode, connectedNodes, grid) {
  let path = [endNode];
  let connected = connectedNodes.get(endNode);
  while (connected) {
    path.push(connected);
    connected = connectedNodes.get(connected);
  }
  path.reverse();

  path.forEach(node => {
    const { y, x } = JSON.parse(node);
    grid[y][x] = '☐';
  });

  grid.forEach(row => console.log(row.join('')));
}

function getRisk(node: string, input: Grid): number {
  const { y, x } = JSON.parse(node);
  return input[y][x];
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
  const sample = `1163751742
1381373672
2136511328
3694931569
7463417111
1319128137
1359912421
3125421639
1293138521
2311944581`.split('\n');

  afterEach(() => jest.restoreAllMocks());

  test('part1', () => {
    const logSpy = mockLog();
    part1(parseInput(sample));
    expect(logSpy).toBeCalledWith(40);
  });

  test('part2', () => {
    const logSpy = mockLog();
    part2(parseInput(sample));
    expect(logSpy).toBeCalledWith(315);
  });
}
