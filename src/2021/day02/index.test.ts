import { data } from "./inputData";

enum Direction {
  Forward = "forward",
  Up = "up",
  Down = "down",
}

type Move = {
  direction: Direction;
  distance: number;
};

type SubPosition = {
  aim: number;
  horizontal: number;
  depth: number;
};

describe("day 2", () => {
  let workData: Move[];

  beforeAll(() => {
    workData = data.split("\n").map((data): Move => {
      const split = data.split(" ");
      return {
        direction: split[0] as Direction,
        distance: +split[1],
      };
    });
  });

  it("1", () => {
    const subPos: SubPosition = {
      aim: 0,
      horizontal: 0,
      depth: 0,
    };
    workData.forEach((move) => {
      switch (move.direction) {
        case Direction.Forward:
          subPos.horizontal += move.distance;
          break;
        case Direction.Down:
          subPos.depth += move.distance;
          break;
        case Direction.Up:
          subPos.depth -= move.distance;
          break;

        default:
          break;
      }
    });
    console.log(
      "final pos:",
      subPos,
      "multiplied:",
      subPos.horizontal * subPos.depth
    );
  });

  it("2", () => {
    const subPos: SubPosition = {
      aim: 0,
      horizontal: 0,
      depth: 0,
    };
    workData.forEach((move) => {
      switch (move.direction) {
        case Direction.Forward:
          subPos.horizontal += move.distance;
          subPos.depth += subPos.aim * move.distance;
          break;
        case Direction.Down:
          subPos.aim += move.distance;
          break;
        case Direction.Up:
          subPos.aim -= move.distance;
          break;

        default:
          break;
      }
    });
    console.log(
      "final pos:",
      subPos,
      "multiplied:",
      subPos.horizontal * subPos.depth
    );
  });
});
