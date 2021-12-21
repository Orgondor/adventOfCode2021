import { data, testData } from "./inputData";
import { Point2d } from "../util";

type TargetArea = {
  from: Point2d;
  to: Point2d;
};

const posAfterSteps = (
  startVelocity: number,
  steps: number,
  y: boolean
): number => {
  let velocity = startVelocity;
  let pos = 0;
  let stepsTaken = 0;
  while ((y || velocity) && stepsTaken < steps) {
    pos += velocity;
    velocity--;
    stepsTaken++;
  }
  return pos;
};

const isInTargetArea = (pos: Point2d, targetArea: TargetArea): boolean => {
  return (
    pos.x >= targetArea.from.x &&
    pos.x <= targetArea.to.x &&
    pos.y <= targetArea.from.y &&
    pos.y >= targetArea.to.y
  );
};

const willHitTarget = (
  startVelocity: Point2d,
  targetArea: TargetArea
): boolean => {
  const stepsAtZeroY = startVelocity.y > 0 ? startVelocity.y * 2 + 1 : 0;
  const pos: Point2d = {
    x: posAfterSteps(startVelocity.x, stepsAtZeroY, false),
    y: 0,
  };
  const velocity: Point2d = {
    x: Math.max(startVelocity.x - stepsAtZeroY, 0),
    y: startVelocity.y > 0 ? -startVelocity.y - 1 : startVelocity.y,
  };

  while (pos.x <= targetArea.to.x && pos.y >= targetArea.to.y) {
    pos.x += velocity.x;
    pos.y += velocity.y;
    if (isInTargetArea(pos, targetArea)) {
      return true;
    }
    velocity.x = Math.max(velocity.x - 1, 0);
    velocity.y--;
  }

  return false;
};

describe("day 17", () => {
  let targetArea: TargetArea;
  let xStart: number;
  let yStart: number;

  beforeAll(() => {
    const coords = data
      .match(/-?[0-9]+..-?[0-9]*/gm)
      .reduce<number[]>(
        (prev, str) => [...prev, ...str.split("..").map((num) => +num)],
        []
      );

    targetArea = {
      from: {
        x: Math.min(coords[0], coords[1]),
        y: Math.max(coords[2], coords[3]),
      },
      to: {
        x: Math.max(coords[0], coords[1]),
        y: Math.min(coords[2], coords[3]),
      },
    };

    xStart = 1;
    let total = xStart;
    while (total < targetArea.from.x) {
      xStart++;
      total += xStart;
    }

    yStart = Math.abs(targetArea.to.y) + 1;
  });

  it("1", () => {
    const velocity: Point2d = { x: xStart, y: yStart };
    let answer = 0;

    while (velocity.y) {
      if (willHitTarget(velocity, targetArea)) {
        answer = posAfterSteps(velocity.y, velocity.y, true);
        break;
      }
      velocity.y--;
    }

    console.log("answer", answer);
  });

  it.only("2", () => {
    let answer = 0;

    for (let vx = xStart; vx <= targetArea.to.x; vx++) {
      for (let vy = yStart; vy >= targetArea.to.y; vy--) {
        const velocity: Point2d = { x: vx, y: vy };
        if (willHitTarget(velocity, targetArea)) {
          answer++;
        }
      }
    }

    console.log("answer", answer);
  });
});
