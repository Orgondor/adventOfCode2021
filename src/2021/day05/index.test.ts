import { data, testData } from "./inputData";
import { Point2d, point2dAdd, point2dSubtract, point2dEqual } from "../util";

type Line = {
  from: Point2d;
  to: Point2d;
};

describe("day 5", () => {
  let lines: Line[];
  let grid: number[][];
  const gridMax: Point2d = { x: 0, y: 0 };

  beforeAll(() => {
    lines = data.split("\n").map((lineStr): Line => {
      const coords = lineStr.split(/,| -> /g).map((num) => +num);
      gridMax.x = Math.max(gridMax.x, coords[0], coords[2]);
      gridMax.y = Math.max(gridMax.y, coords[1], coords[3]);
      return {
        from: { x: coords[0], y: coords[1] },
        to: { x: coords[2], y: coords[3] },
      };
    });
  });

  beforeEach(() => {
    grid = [...Array(gridMax.x + 1)].map(() =>
      [...Array(gridMax.y + 1)].map(() => 0)
    );
  });

  it("1", () => {
    const hvLines = lines.filter(
      (line) => line.from.x === line.to.x || line.from.y === line.to.y
    );
    hvLines.forEach((line) => {
      const direction: Point2d = point2dSubtract(line.to, line.from);
      if (direction.x !== 0) {
        direction.x = direction.x > 0 ? 1 : -1;
      } else {
        direction.y = direction.y > 0 ? 1 : -1;
      }
      let pos = line.from;
      grid[pos.x][pos.y] += 1;
      while (!point2dEqual(pos, line.to)) {
        pos = point2dAdd(pos, direction);
        grid[pos.x][pos.y] += 1;
      }
    });

    const overlaping = grid.reduce<number>((prevRowSum, row) => {
      const sum = row.reduce<number>(
        (prev, num) => (num > 1 ? prev + 1 : prev),
        0
      );
      return sum + prevRowSum;
    }, 0);

    console.log("overlaping", overlaping);
  });

  it.only("2", () => {
    lines.forEach((line) => {
      const direction: Point2d = point2dSubtract(line.to, line.from);
      if (direction.x !== 0) {
        direction.x = direction.x > 0 ? 1 : -1;
      }
      if (direction.y !== 0) {
        direction.y = direction.y > 0 ? 1 : -1;
      }
      let pos = line.from;
      grid[pos.x][pos.y] += 1;
      while (!point2dEqual(pos, line.to)) {
        pos = point2dAdd(pos, direction);
        grid[pos.x][pos.y] += 1;
      }
    });

    const overlaping = grid.reduce<number>((prevRowSum, row) => {
      const sum = row.reduce<number>(
        (prev, num) => (num > 1 ? prev + 1 : prev),
        0
      );
      return sum + prevRowSum;
    }, 0);

    console.log("overlaping", overlaping);
  });
});
