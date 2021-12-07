import { readInput, day, mockLog } from './helpers';

function part1(input) {
  const { numbers, boards } = splitInput(input);

  const playedBoards = generateBoards(boards);

  let winningNumber: number;
  let winningBoard: number;

  try {
    // board[row][column]
    numbers.forEach(number => {
      boards.forEach((board, index) => {
        for (let row = 0; row < 5; row++) {
          for (let column = 0; column < 5; column++) {
            if (board[row][column] === number) playedBoards[index][row][column] = 1;
            if (findBingo(playedBoards[index], row, column)) {
              winningNumber = parseInt(number);
              winningBoard = index;
              throw Error;
            }
          }
        }
      });
    });
  } catch {
    console.log(sumUnmarked(boards[winningBoard], playedBoards[winningBoard]) * winningNumber);
  }
}

function part2(input: string[]) {
  const { numbers, boards } = splitInput(input);

  const playedBoards = generateBoards(boards);

  const winningBoards = new Array(boards.length).fill(0);
  let lastWinningBoard: number;
  let lastWinningNumber: number;

  try {
    numbers.forEach(number => {
      boards.forEach((board, index) => {
        for (let row = 0; row < 5; row++) {
          for (let column = 0; column < 5; column++) {
            if (board[row][column] === number) playedBoards[index][row][column] = 1;
            if (findBingo(playedBoards[index], row, column)) {
              winningBoards[index] = 1;
              if (boards.length == winningBoards.filter(x => x).length) {
                lastWinningNumber = parseInt(number);
                lastWinningBoard = index;
                throw Error;
              }
            }
          }
        }
      });
    });
  } catch {
    console.log(sumUnmarked(boards[lastWinningBoard], playedBoards[lastWinningBoard]) * lastWinningNumber);
  }
}

function splitInput(input) {
  const numbers = input[0].split(',');
  // remove whitespace, chunk into 5 row boards, split columns into matrix, remove whitespace again
  const boards = chunkArray(
    input.slice(2).filter(x => x),
    5
  ).map(board => board.map(row => row.split(' ').filter(x => x)));
  return { numbers, boards };
}

function chunkArray(array, size) {
  let newArray = [];
  for (let i = 0; i < array.length; i += size) {
    newArray.push(array.slice(i, i + size));
  }
  return newArray;
}

/* mirror board sizes to track numbers found */
function generateBoards(boards) {
  return new Array(boards.length)
    .fill(null)
    .map(() => new Array(5).fill(null).map(() => new Array(5).fill(null).map(() => 0)));
}

function findBingo(board, row, column) {
  const rowSum = board[row].reduce((acc, c) => ((acc += c), acc), 0);
  const columnSum = board.reduce((acc, r, i) => ((acc += board[i][column]), acc), 0);
  return rowSum == 5 || columnSum == 5;
}

function sumUnmarked(board, playedBoard) {
  let sum = 0;
  for (let row = 0; row < 5; row++) {
    for (let column = 0; column < 5; column++) {
      if (!playedBoard[row][column]) sum += parseInt(board[row][column]);
    }
  }
  return sum;
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
  const sample = `7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

  22 13 17 11  0
  8  2 23  4 24
  21  9 14 16  7
  6 10  3 18  5
  1 12 20 15 19

  3 15  0  2 22
  9 18 13 17  5
  19  8  7 25 23
  20 11 10 24  4
  14 21 16 12  6

  14 21 17 24  4
  10 16 15  9 19
  18  8 23 26 20
  22 11 13  6  5
  2  0 12  3  7`.split('\n');

  test('part1', () => {
    const logSpy = mockLog();
    part1(sample);
    expect(logSpy).toBeCalledWith(4512);
  });

  test('part2', () => {
    const logSpy = mockLog();
    part2(sample);
    expect(logSpy).toBeCalledWith(1924);
  });
}
