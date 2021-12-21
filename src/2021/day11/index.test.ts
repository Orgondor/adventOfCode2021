import { data, testData } from "./inputData";
import { Point2d } from "../util";

type Octopus = {
  energyLevel: number;
  flash: boolean;
};

type Neighbour = {
  octopus: Octopus;
  pos: Point2d;
};

const offset = [-1, 0, 1];

const getNeighbours = (grid: Octopus[][], pos: Point2d): Neighbour[] => {
  const neighbours: Neighbour[] = [];
  offset.forEach((offsetX) => {
    offset.forEach((offsetY) => {
      if (offsetX || offsetY) {
        const x = pos.x + offsetX;
        const y = pos.y + offsetY;
        if (x >= 0 && x < grid.length && y >= 0 && y < grid[x].length) {
          neighbours.push({
            octopus: grid[x][y],
            pos: { x, y },
          });
        }
      }
    });
  });
  return neighbours;
};

const flash = (grid: Octopus[][], pos: Point2d): number => {
  let flashes = 0;
  const octopus = grid[pos.x][pos.y];
  if (octopus.energyLevel > 9 && !octopus.flash) {
    flashes += 1;
    octopus.flash = true;
    const neighbours = getNeighbours(grid, pos);
    neighbours.forEach((neighbour) => {
      neighbour.octopus.energyLevel += 1;
      flashes += flash(grid, neighbour.pos);
    });
  }
  return flashes;
};

const energyStep = (grid: Octopus[][]): number => {
  let flashes = 0;
  grid.forEach((row, i) => {
    row.forEach((octopus, j) => {
      octopus.energyLevel += 1;
      flashes += flash(grid, { x: i, y: j });
    });
  });
  grid.forEach((row, i) => {
    row.forEach((octopus, j) => {
      octopus.flash = false;
      if (octopus.energyLevel > 9) {
        octopus.energyLevel = 0;
      }
    });
  });
  return flashes;
};

const printGrid = (grid: Octopus[][]) => {
  console.log(
    grid.reduce<string>(
      (prevRow, row, i) =>
        prevRow +
        (i ? "\n" : "") +
        row.reduce<string>((prev, octo) => prev + octo.energyLevel, ""),
      ""
    )
  );
};

describe("day 11", () => {
  let octopuses: Octopus[][];

  beforeAll(() => {
    octopuses = data.split("\n").map((row) =>
      [...row].map((num) => ({
        energyLevel: +num,
        flash: false,
      }))
    );
  });

  it("1", () => {
    let flashes = 0;
    for (let i = 0; i < 100; i++) {
      flashes += energyStep(octopuses);
    }
    console.log("flashes", flashes);
  });

  it.only("2", () => {
    let steps = 1;
    while (energyStep(octopuses) !== 100) {
      steps += 1;
    }
    console.log("steps", steps);
  });
});
