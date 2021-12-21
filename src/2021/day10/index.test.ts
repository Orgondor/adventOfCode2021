import { data, testData } from "./inputData";

type ChunkDelimiter = {
  opening: string;
  closing: string;
  corruptionScore: number;
  closingScore: number;
};

const delimiters: ChunkDelimiter[] = [
  {
    opening: "(",
    closing: ")",
    corruptionScore: 3,
    closingScore: 1,
  },
  {
    opening: "[",
    closing: "]",
    corruptionScore: 57,
    closingScore: 2,
  },
  {
    opening: "{",
    closing: "}",
    corruptionScore: 1197,
    closingScore: 3,
  },
  {
    opening: "<",
    closing: ">",
    corruptionScore: 25137,
    closingScore: 4,
  },
];

const closings = delimiters.map((delimiter) => delimiter.closing);

const findCorruptionScore = (
  row: string[],
  pos = 0,
  activeCunks: ChunkDelimiter[] = []
): number => {
  if (pos < row.length) {
    if (closings.includes(row[pos])) {
      if (
        activeCunks.length &&
        activeCunks[activeCunks.length - 1].closing === row[pos]
      ) {
        activeCunks.pop();
        return findCorruptionScore(row, pos + 1, activeCunks);
      }
      return (
        delimiters.find((delimiter) => delimiter.closing === row[pos])
          ?.corruptionScore || 0
      );
    }
    activeCunks.push(
      delimiters.find((delimiter) => delimiter.opening === row[pos])
    );
    return findCorruptionScore(row, pos + 1, activeCunks);
  }

  return 0;
};

const findClosers = (
  row: string[],
  pos = 0,
  activeCunks: ChunkDelimiter[] = []
): ChunkDelimiter[] => {
  if (pos < row.length) {
    if (closings.includes(row[pos])) {
      if (
        activeCunks.length &&
        activeCunks[activeCunks.length - 1].closing === row[pos]
      ) {
        activeCunks.pop();
        return findClosers(row, pos + 1, activeCunks);
      }
      return [];
    }
    activeCunks.push(
      delimiters.find((delimiter) => delimiter.opening === row[pos])
    );
    return findClosers(row, pos + 1, activeCunks);
  }

  return activeCunks;
};

describe("day 10", () => {
  let subsystem: string[][];

  beforeAll(() => {
    subsystem = data.split("\n").map((row) => [...row]);
  });

  it("1", () => {
    const scores = subsystem.map((row) => findCorruptionScore(row));
    const sum = scores.reduce<number>((prev, score) => score + prev, 0);
    console.log("answer:", sum);
  });

  it.only("2", () => {
    const closers = subsystem
      .map((row) => findClosers(row))
      .filter((rows) => !!rows.length);
    const scores = closers
      .map((row) =>
        row
          .reverse()
          .reduce((prev, closer) => prev * 5 + closer.closingScore, 0)
      )
      .sort((a, b) => a - b);
    console.log("scores:", scores);
    console.log("answer:", scores[Math.floor(scores.length / 2)]);
  });
});
