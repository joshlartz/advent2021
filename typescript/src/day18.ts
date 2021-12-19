import { readInput, day, mockLog } from './helpers';

type Input = string[];

class Node {
  value?: number;
  left?: Node;
  right?: Node;
  parent?: Node;
  constructor(value?: number | number[], parent?: Node) {
    if (value === undefined) return;
    this.parent = parent;
    if (typeof value == 'number') this.value = value;
    if (typeof value == 'object') {
      this.left = new Node(value[0], this);
      this.right = new Node(value[1], this);
    }
  }

  get isLeaf() {
    return this.left === undefined && this.right === undefined;
  }

  get depth() {
    const findDepth = (node: Node, depth = 0) => (node.parent ? findDepth(node.parent, depth + 1) : depth);
    return findDepth(this);
  }

  remove() {
    if (this.parent.right === this) this.parent.right = undefined;
    if (this.parent.left === this) this.parent.left = undefined;
  }

  explode() {
    const leftLeaf = findLeftLeaf(this);
    if (leftLeaf) leftLeaf.value += this.left.value;
    const rightLeaf = findRightLeaf(this);
    if (rightLeaf) rightLeaf.value += this.right.value;
    this.left = undefined;
    this.right = undefined;
    this.value = 0;
  }

  split() {
    this.left = new Node(Math.floor(this.value / 2), this);
    this.right = new Node(Math.ceil(this.value / 2), this);
    this.value = undefined;
  }

  private toArray() {
    return this.value !== undefined ? this.value : [this.left.toArray(), this.right.toArray()];
  }

  toString() {
    return JSON.stringify(this.toArray());
  }

  get magnitude() {
    if (this.value !== undefined) return this.value;
    return this.left.magnitude * 3 + this.right.magnitude * 2;
}
}

function part1(input: Input) {
  let pairs = input.map(line => JSON.parse(line));
  let tree = new Node(pairs[0]);

  for (let i = 1; i < pairs.length; i++) {
    tree = add(tree, new Node(pairs[i]));
    reduce(tree);
  }
  // console.log(tree.toString());
  console.log(tree.magnitude);
}

function part2(input: Input) {
  let pairs = input.map(line => JSON.parse(line));
  let magnitude = 0;

  for (let i = 0; i < pairs.length; i++) {
    for (let j = 0; j < pairs.length; j++) {
      let tree = add(new Node(pairs[i]), new Node(pairs[j]));
      reduce(tree);
      if (tree.magnitude > magnitude) magnitude = tree.magnitude;
    }
  }
  console.log(magnitude);
}

function add(t1: Node, t2: Node) {
  const tree = new Node();
  tree.left = t1;
  tree.right = t2;
  [t1, t2].forEach(t => (t.parent = tree));
  return tree;
}

function reduce(tree: Node) {
  // 4th pair, explode
  const explodable = getExplodablePair(tree);
  if (explodable) {
    explodable.explode();
    return reduce(tree);
  }

  // value > 9, split
  const splitable = getSplitable(tree);
  if (splitable) {
    splitable.split();
    return reduce(tree);
  }
}

function getExplodablePair(node: Node) {
  if (!node) return;
  if (node.depth > 4 && node.parent.left.isLeaf && node.parent.right.isLeaf) return node.parent;
  return getExplodablePair(node.left) || getExplodablePair(node.right);
}

function getSplitable(node: Node) {
  if (!node) return;
  if (node.isLeaf && node.value > 9) return node;
  return getSplitable(node.left) || getSplitable(node.right);
}

function findLeftLeafDown(node: Node) {
  if (!node) return;
  if (node.isLeaf) return node;
  if (node.left) return findLeftLeafDown(node.left);
  if (node.right) return findLeftLeafDown(node.right);
}

function findRightLeafDown(node: Node) {
  if (!node) return;
  if (node.isLeaf) return node;
  if (node.right) return findRightLeafDown(node.right);
  if (node.left) return findRightLeafDown(node.left);
}

function findLeftLeaf(node: Node) {
  if (!node.parent) return;
  if (node.parent.left === node) return findLeftLeaf(node.parent);
  return findRightLeafDown(node.parent.left);
}

function findRightLeaf(node: Node) {
  if (!node.parent) return;
  if (node.parent.right === node) return findRightLeaf(node.parent);
  return findLeftLeafDown(node.parent.right);
}

if (require.main === module) {
  const input = readInput(day(__filename)).filter(x => x);

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
  const sample = `[[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]
[[[5,[2,8]],4],[5,[[9,9],0]]]
[6,[[[6,2],[5,6]],[[7,6],[4,7]]]]
[[[6,[0,7]],[0,9]],[4,[9,[9,0]]]]
[[[7,[6,4]],[3,[1,3]]],[[[5,5],1],9]]
[[6,[[7,3],[3,2]]],[[[3,8],[5,7]],4]]
[[[[5,4],[7,7]],8],[[8,3],8]]
[[9,3],[[9,9],[6,[4,9]]]]
[[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]]
[[[[5,2],5],[8,[3,7]]],[[5,[7,5]],[4,4]]]`.split('\n');

  afterEach(() => jest.restoreAllMocks());

  test('part1 sample1', () => {
    const logSpy = mockLog();
    part1(sample);
    expect(logSpy).toBeCalledWith(4140);
  });

  test('part2', () => {
    const logSpy = mockLog();
    part2(sample);
    expect(logSpy).toBeCalledWith(3993);
  });
}
