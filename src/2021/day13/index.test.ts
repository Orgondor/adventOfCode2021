import { data, testData } from "./inputData";
import { Point2d, point2dAdd, point2dSubtract, point2dEqual } from "../util";

const fold = (dotMatrix: Point2d[], fold: Point2d): Point2d[] => {
  if ((!fold.x && !fold.y) || (fold.x && fold.y)) {
    throw new Error("invalid fold");
  }

  const folded = dotMatrix.filter(
    (point) => point.x < fold.x || point.y < fold.y
  );
  const toFold = dotMatrix.filter(
    (point) => point.x >= fold.x && point.y >= fold.y
  );

  toFold.forEach((point) => {
    const doubleFold = point2dAdd(fold, fold);
    const toFoldDir: Point2d = {
      x: fold.x > 0 ? (point.x - fold.x) * 2 : 0,
      y: fold.y > 0 ? (point.y - fold.y) * 2 : 0,
    };
    const foldedPoint = point2dSubtract(point, toFoldDir);
    if (!folded.some((f) => point2dEqual(f, foldedPoint))) {
      folded.push(foldedPoint);
    }
  });

  return folded;
};

const printMatrix = (dotMatrix: Point2d[]) => {
  const xMax = dotMatrix.reduce<number>(
    (prev, point) => (point.x > prev ? point.x : prev),
    0
  );
  const yMax = dotMatrix.reduce<number>(
    (prev, point) => (point.y > prev ? point.y : prev),
    0
  );

  let matrix = "";
  for (let y = 0; y <= yMax; y++) {
    matrix += matrix ? "\n" : "";
    for (let x = 0; x <= xMax; x++) {
      matrix += dotMatrix.some((point) => point2dEqual(point, { x, y }))
        ? "#"
        : ".";
    }
  }

  console.log(matrix);
};

describe("day 13", () => {
  let dotMatrix: Point2d[];
  let folds: Point2d[];

  beforeAll(() => {
    const [dots, foldLines] = data.split("\n\n");
    dotMatrix = dots.split("\n").map((coords): Point2d => {
      const [x, y] = coords.split(",").map((num) => +num);
      return {
        x,
        y,
      };
    });
    folds = foldLines.split("\n").map((row): Point2d => {
      const [dir, magnitude] = row.substr(11).split("=");
      return {
        x: dir === "x" ? +magnitude : 0,
        y: dir === "y" ? +magnitude : 0,
      };
    });
  });

  it("1", () => {
    const foldMatrix = fold(dotMatrix, folds[0]);
    console.log("answer:", foldMatrix.length);
  });

  it.only("2", () => {
    let foldMatrix = dotMatrix;
    folds.forEach((element) => {
      foldMatrix = fold(foldMatrix, element);
    });
    printMatrix(foldMatrix);
  });
});
