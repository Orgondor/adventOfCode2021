import { data, testData } from "./inputData";
import { Point2d } from "../util";

const basinChecker = (heightMap: number[][], checked: boolean[][]) =>
  function recursive(pos: Point2d): number {
    if (heightMap[pos.x][pos.y] === 9 || checked[pos.x][pos.y]) {
      return 0;
    }
    checked[pos.x][pos.y] = true;

    let up = 0;
    if (pos.x > 0) {
      up = recursive({ x: pos.x - 1, y: pos.y });
    }
    let down = 0;
    if (pos.x < heightMap.length - 1) {
      down = recursive({ x: pos.x + 1, y: pos.y });
    }
    let left = 0;
    if (pos.y > 0) {
      left = recursive({ x: pos.x, y: pos.y - 1 });
    }
    let right = 0;
    if (pos.y < heightMap[0].length - 1) {
      right = recursive({ x: pos.x, y: pos.y + 1 });
    }

    return 1 + up + down + left + right;
  };

describe("day ", () => {
  let heightMap: number[][];
  const lowPoints: Point2d[] = [];
  let width: number;
  let height: number;

  beforeAll(() => {
    heightMap = data.split("\n").map((row) => [...row].map((num) => +num));
    height = heightMap.length;
    width = heightMap[0].length;
    heightMap.forEach((row, rowId) => {
      row.forEach((digit, colId) => {
        if (rowId === 0 || heightMap[rowId - 1][colId] > digit) {
          if (colId === 0 || heightMap[rowId][colId - 1] > digit) {
            if (rowId === height - 1 || heightMap[rowId + 1][colId] > digit) {
              if (colId === width - 1 || heightMap[rowId][colId + 1] > digit) {
                lowPoints.push({ x: rowId, y: colId });
              }
            }
          }
        }
      });
    });
  });

  it("1", () => {
    const riskSum = lowPoints.reduce<number>(
      (prev, point) => prev + heightMap[point.x][point.y] + 1,
      0
    );
    console.log("risk sum:", riskSum);
  });

  it.only("2", () => {
    const checked = [...Array(heightMap.length)].map(() =>
      [...Array(heightMap[0].length)].map(() => false)
    );
    const checker = basinChecker(heightMap, checked);
    const basinSize = lowPoints.map((pos) => checker(pos));

    const sortedSizes = basinSize.sort((a, b) => b - a);

    console.log(
      "basin size product:",
      sortedSizes[0] * sortedSizes[1] * sortedSizes[2]
    );
  });
});
