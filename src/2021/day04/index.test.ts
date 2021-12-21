import { data } from "./inputData";

type BoardNumber = {
  num: number;
  called: boolean;
};

type Board = {
  index: number;
  win: boolean;
  boardNumbers: BoardNumber[][];
};

type BingoWin = {
  win: boolean;
  nums?: BoardNumber[];
};

const callNumber = (called: number, board: Board): BingoWin => {
  let row = -1;
  let col = -1;

  board.boardNumbers.some((rowNum, rowId) => {
    const found = rowNum.some((bNum, colId) => {
      if (bNum.num === called) {
        bNum.called = true;
        col = colId;
        return true;
      }
      return false;
    });

    if (found) {
      row = rowId;
    }

    return found;
  });

  if (row >= 0 && col >= 0) {
    let win = checkBingo(board.boardNumbers[row]);
    if (win) {
      board.win = true;
      return { win, nums: board.boardNumbers[row] };
    }

    const column = board.boardNumbers.map((row) => row[col]);
    win = checkBingo(column);
    board.win = win;
    return { win: win, nums: column };
  }

  return { win: false };
};

const checkBingo = (nums: BoardNumber[]) =>
  nums.reduce<boolean>((prev, bNum) => prev && bNum.called, true);

const checkBingoRows = (board: Board): BingoWin => {
  let i = 0;
  const win = board.boardNumbers.some((row, rowId) => {
    i = rowId;
    return checkBingo(row);
  });

  return { win, nums: board.boardNumbers[i] };
};

const checkBingoColumns = (board: Board): BingoWin => {
  for (let i = 0; i < board.boardNumbers[0].length; i++) {
    const elements = board.boardNumbers.map((row) => row[i]);
    if (checkBingo(elements)) {
      return { win: true, nums: elements };
    }
  }
  return { win: false };
};

const checkBingoBoard = (board: Board): BingoWin => {
  const rowResult = checkBingoRows(board);
  if (rowResult.win) {
    return rowResult;
  }
  const colResult = checkBingoColumns(board);
  return colResult;
};

const uncalledSum = (board: Board): number => {
  return board.boardNumbers.reduce<number>(
    (prev, cur) =>
      prev +
      cur.reduce<number>((pre, cu) => {
        return cu.called ? pre : pre + cu.num;
      }, 0),
    0
  );
};

describe("day 4", () => {
  let callNumbers: number[];
  let boards: Board[];

  beforeAll(() => {
    const tmp = data.split("\n\n");

    callNumbers = tmp
      .splice(0, 1)[0]
      .split(",")
      .map((num) => +num);

    boards = tmp.map(
      (boardString, i): Board => ({
        index: i,
        win: false,
        boardNumbers: boardString.split("\n").map((rowNumbers) =>
          rowNumbers
            .trim()
            .replace(/  /g, " ")
            .split(" ")
            .map((num): BoardNumber => ({ num: +num, called: false }))
        ),
      })
    );
  });

  it("1", () => {
    let win = false;
    let bingoWin: BingoWin;
    let boardWin: number;
    let calledId = -1;

    while (!win) {
      calledId += 1;
      const called = callNumbers[calledId];

      win = boards.some((board, j) => {
        boardWin = j;
        bingoWin = callNumber(called, board);
        return bingoWin.win;
      });
    }

    boards[boardWin].boardNumbers.forEach((row) => console.log("row:", row));

    console.log("boardWin:", boardWin);
    console.log("bingoWin:", bingoWin);
    const sum = uncalledSum(boards[boardWin]);
    console.log("sum:", sum);
    console.log("last num:", callNumbers[calledId]);
    console.log("answer:", sum * callNumbers[calledId]);
  });

  it.only("2", () => {
    let allWon = false;
    let boardWin = -1;
    let calledId = -1;
    let playingBoards = boards.filter((board) => !board.win);

    while (!allWon) {
      calledId += 1;
      const called = callNumbers[calledId];

      playingBoards.forEach((board) => {
        const bingoWin = callNumber(called, board);
        if (bingoWin.win) {
          boardWin = board.index;
        }
      });
      playingBoards = boards.filter((board) => !board.win);
      allWon = !playingBoards.length;
    }

    const sum = uncalledSum(boards[boardWin]);
    console.log("sum:", sum);
    console.log("last num:", callNumbers[calledId]);
    console.log("answer:", sum * callNumbers[calledId]);
  });
});
