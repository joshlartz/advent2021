import { readInput, day, mockLog } from './helpers';
import { readFileSync } from 'fs';

// x, y, z
type Beacon = [number, number, number];
type Scanner = Beacon[];

const cartesianProduct = (...a) => a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())));

function part1(input) {
  const scanners: Scanner[] = JSON.parse(JSON.stringify(input));
  const orientedScanners: Scanner[] = [scanners.shift()];
  const normalizeFactors: Beacon[] = [];

  start: while (scanners.length) {
    for (let i = 0; i < scanners.length; i++) {
      for (let oriented of orientedScanners) {
        let match = findMatchingScanners(scanners[i], oriented);
        if (match) {
          scanners.splice(i, 1);
          orientedScanners.push(match.orientedScanner.map(beacon => add(beacon, match.normalizeFactor)));
          normalizeFactors.push(match.normalizeFactor);
          console.log('scanners:', scanners.length, 'oriented:', orientedScanners.length);
          continue start;
        }
      }
    }
  }
  // console.log(normalizeFactors);
  // console.log('scanners:', scanners.length);
  // console.log('oriented:', orientedScanners.length);
  console.log([...new Set(orientedScanners.flat().map(b => JSON.stringify(b)))].length);
}

function part2(input) {}

function findMatchingScanners(scanner: Scanner, oriented: Scanner) {
  // try every rotation of the scanner until it overlaps
  for (let rotation of rotations(scanner)) {
    // for each beacon in the current scanner, calculate the difference from the base beacon
    let allDiffs = rotation
      .flatMap(beacon => oriented.map(orientedBeacon => subtract(orientedBeacon, beacon)))
      // count the occurances of diffs
      .reduce(count, {});

    // any diff that was found at least 12 times is a match
    let diffs = Object.entries(allDiffs)
      .filter(([diff, count]) => count >= 12)
      .map(([diff, count]) => JSON.parse(diff)) as Beacon[];

    if (diffs.length) return { orientedScanner: rotation, normalizeFactor: diffs[0] };
  }
}

function add(b1: Beacon, b2: Beacon): Beacon {
  return b1.map((each, i) => each + b2[i]) as Beacon;
}

function subtract(b1: Beacon, b2: Beacon): Beacon {
  return b1.map((each, i) => each - b2[i]) as Beacon;
}

function count(acc, difference: Beacon) {
  const diff = JSON.stringify(difference);
  acc[diff] = (acc[diff] || 0) + 1;
  return acc;
}

// TODO: generate this, 6 faces, 4 rotations
function* rotations(scanner: Scanner): Generator<Scanner> {
  yield scanner.map(([x, y, z]) => [x, y, z]);
  yield scanner.map(([x, y, z]) => [y, -x, z]);
  yield scanner.map(([x, y, z]) => [-x, -y, z]);
  yield scanner.map(([x, y, z]) => [-y, x, z]);
  yield scanner.map(([x, y, z]) => [z, y, -x]);
  yield scanner.map(([x, y, z]) => [y, -z, -x]);
  yield scanner.map(([x, y, z]) => [-z, -y, -x]);
  yield scanner.map(([x, y, z]) => [-y, z, -x]);
  yield scanner.map(([x, y, z]) => [-x, y, -z]);
  yield scanner.map(([x, y, z]) => [y, x, -z]);
  yield scanner.map(([x, y, z]) => [x, -y, -z]);
  yield scanner.map(([x, y, z]) => [-y, -x, -z]);
  yield scanner.map(([x, y, z]) => [-z, y, x]);
  yield scanner.map(([x, y, z]) => [y, z, x]);
  yield scanner.map(([x, y, z]) => [z, -y, x]);
  yield scanner.map(([x, y, z]) => [-y, -z, x]);
  yield scanner.map(([x, y, z]) => [x, -z, y]);
  yield scanner.map(([x, y, z]) => [-z, -x, y]);
  yield scanner.map(([x, y, z]) => [-x, z, y]);
  yield scanner.map(([x, y, z]) => [z, x, y]);
  yield scanner.map(([x, y, z]) => [x, z, -y]);
  yield scanner.map(([x, y, z]) => [z, -x, -y]);
  yield scanner.map(([x, y, z]) => [-x, -z, -y]);
}

function parseInput(input: string): Scanner[] {
  return input.split('\n\n').map(scanner =>
    scanner
      .split('\n')
      .map(line => (line.startsWith('---') ? '' : line))
      .filter(x => x)
      .map(beacon => beacon.split(',').map(Number) as Beacon)
  );
}

if (require.main === module) {
  const input = parseInput(readFileSync(`${__dirname}/../../inputs/day${day(__filename)}.txt`, { encoding: 'utf-8' }));

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
  const sample = `--- scanner 0 ---
404,-588,-901
528,-643,409
-838,591,734
390,-675,-793
-537,-823,-458
-485,-357,347
-345,-311,381
-661,-816,-575
-876,649,763
-618,-824,-621
553,345,-567
474,580,667
-447,-329,318
-584,868,-557
544,-627,-890
564,392,-477
455,729,728
-892,524,684
-689,845,-530
423,-701,434
7,-33,-71
630,319,-379
443,580,662
-789,900,-551
459,-707,401

--- scanner 1 ---
686,422,578
605,423,415
515,917,-361
-336,658,858
95,138,22
-476,619,847
-340,-569,-846
567,-361,727
-460,603,-452
669,-402,600
729,430,532
-500,-761,534
-322,571,750
-466,-666,-811
-429,-592,574
-355,545,-477
703,-491,-529
-328,-685,520
413,935,-424
-391,539,-444
586,-435,557
-364,-763,-893
807,-499,-711
755,-354,-619
553,889,-390

--- scanner 2 ---
649,640,665
682,-795,504
-784,533,-524
-644,584,-595
-588,-843,648
-30,6,44
-674,560,763
500,723,-460
609,671,-379
-555,-800,653
-675,-892,-343
697,-426,-610
578,704,681
493,664,-388
-671,-858,530
-667,343,800
571,-461,-707
-138,-166,112
-889,563,-600
646,-828,498
640,759,510
-630,509,768
-681,-892,-333
673,-379,-804
-742,-814,-386
577,-820,562

--- scanner 3 ---
-589,542,597
605,-692,669
-500,565,-823
-660,373,557
-458,-679,-417
-488,449,543
-626,468,-788
338,-750,-386
528,-832,-391
562,-778,733
-938,-730,414
543,643,-506
-524,371,-870
407,773,750
-104,29,83
378,-903,-323
-778,-728,485
426,699,580
-438,-605,-362
-469,-447,-387
509,732,623
647,635,-688
-868,-804,481
614,-800,639
595,780,-596

--- scanner 4 ---
727,592,562
-293,-554,779
441,611,-461
-714,465,-776
-743,427,-804
-660,-479,-426
832,-632,460
927,-485,-438
408,393,-506
466,436,-512
110,16,151
-258,-428,682
-393,719,612
-211,-452,876
808,-476,-593
-575,615,604
-485,667,467
-680,325,-822
-627,-443,-432
872,-547,-609
833,512,582
807,604,487
839,-516,451
891,-625,532
-652,-548,-490
30,-46,-14`;

  afterEach(() => jest.restoreAllMocks());

  test('part1 sample1', () => {
    const logSpy = mockLog();
    part1(parseInput(sample));
    expect(logSpy).toBeCalledWith(79);
  });

  // test('part2', () => {
  //   const logSpy = mockLog();
  //   part2(sample);
  //   expect(logSpy).toBeCalledWith(3993);
  // });
}
