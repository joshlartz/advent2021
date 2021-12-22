import { readInput, day, mockLog } from './helpers';

type Input = number[];
type Player = { position: number; score: number };

function part1(input: Input) {
  const players: Player[] = [
    { position: input[0], score: 0 },
    { position: input[1], score: 0 }
  ];
  let dice = roll();
  let rolls = 0;
  let losingScore = 0;

  while (players[0].score < 1000 && players[1].score < 1000) {
    let turn: number = dice.next().value + dice.next().value + dice.next().value;
    rolls += 3;
    move(players[0], turn);

    if (players[0].score >= 1000) {
      losingScore = players[1].score;
      break;
    }

    turn = dice.next().value + dice.next().value + dice.next().value;
    rolls += 3;
    move(players[1], turn);

    if (players[1].score >= 1000) losingScore = players[0].score;
  }

  console.log(losingScore * rolls);
}

function part2(input: Input) {
  const players: Player[] = [
    { position: input[0], score: 0 },
    { position: input[1], score: 0 }
  ];
  let dice = roll();
  let rolls = 0;
  let losingScore = 0;

  while (players[0].score < 21 && players[1].score < 21) {
    let turn: number = dice.next().value + dice.next().value + dice.next().value;
    rolls += 3;
    move(players[0], turn);

    if (players[0].score >= 21) {
      losingScore = players[1].score;
      break;
    }

    turn = dice.next().value + dice.next().value + dice.next().value;
    rolls += 3;
    move(players[1], turn);

    if (players[1].score >= 21) losingScore = players[0].score;
  }

  console.log(losingScore * rolls);
}

function* roll(): Generator<number> {
  while (true) {
    for (let dice = 1; dice <= 100; dice++) {
      yield dice;
    }
  }
}

function move(player: Player, dice: number) {
  let newPosition = player.position + dice;
  while (newPosition > 10) {
    newPosition -= 10;
  }
  player.position = newPosition;
  player.score += player.position;
}

function parseInput(input: string[]): Input {
  return [parseInt(input[0].split(': ')[1]), parseInt(input[1].split(': ')[1])];
}

if (require.main === module) {
  const input = parseInput(readInput(day(__filename)));
//   const input = parseInput(
//     `Player 1 starting position: 4
// Player 2 starting position: 8`.split('\n')
//   );

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
  const sample = `Player 1 starting position: 4
Player 2 starting position: 8`.split('\n');

  afterEach(() => jest.restoreAllMocks());

  test('part1 sample1', () => {
    const logSpy = mockLog();
    part1(parseInput(sample));
    expect(logSpy).toBeCalledWith(739785);
  });

  // test('part2', () => {
  //   const logSpy = mockLog();
  //   part2(parseInput(sample));
  //   expect(logSpy).toBeCalledWith(3351);
  // });
}
