import { data, testData } from "./inputData";
import {
  Cuboid,
  getCuboidIntersection,
  getNumCubes,
  removeCuboid,
} from "../util";

type Instruction = {
  cuboid: Cuboid;
  on: boolean;
};

describe("day 22", () => {
  const allInstructions: Instruction[] = [];
  const startInstructions: Instruction[] = [];
  let activeCuboids: Cuboid[] = [];
  const initializationVolume: Cuboid = {
    from: { x: -50, y: -50, z: -50 },
    to: { x: 50, y: 50, z: 50 },
  };

  const activateCuboid = (cuboid: Cuboid) => {
    let newCuboids: Cuboid[] = [cuboid];

    activeCuboids.forEach((active) => {
      const tmp: Cuboid[] = [];

      newCuboids.forEach((newCuboid) => {
        tmp.push(...removeCuboid(active, newCuboid));
      });

      newCuboids = tmp;
    });

    activeCuboids.push(...newCuboids);
  };

  const deactivateCuboid = (cuboid: Cuboid) => {
    const stillActive: Cuboid[] = [];
    activeCuboids.forEach((active) => {
      stillActive.push(...removeCuboid(cuboid, active));
    });

    activeCuboids = stillActive;
  };

  const runInstructions = (instructions: Instruction[]) => {
    instructions.forEach((instruction) => {
      if (instruction.on) {
        activateCuboid(instruction.cuboid);
      } else {
        deactivateCuboid(instruction.cuboid);
      }
    });
  };

  const sumActiveCubes = (): number => {
    let sum = 0;
    activeCuboids.forEach((active) => {
      sum += getNumCubes(active);
    });
    return sum;
  };

  beforeAll(() => {
    data.split("\n").forEach((row) => {
      const parts = row.split(/ x=|\.\.|,[yz]=/g);
      allInstructions.push({
        on: parts[0] === "on",
        cuboid: {
          from: {
            x: Math.min(+parts[1], +parts[2]),
            y: Math.min(+parts[3], +parts[4]),
            z: Math.min(+parts[5], +parts[6]),
          },
          to: {
            x: Math.max(+parts[1], +parts[2]),
            y: Math.max(+parts[3], +parts[4]),
            z: Math.max(+parts[5], +parts[6]),
          },
        },
      });
    });

    const firstAfterStart = allInstructions.findIndex(
      (instruction) =>
        !getCuboidIntersection(instruction.cuboid, initializationVolume)
    );
    startInstructions.push(...allInstructions.slice(0, firstAfterStart));
  });

  it("1", () => {
    runInstructions(startInstructions);
    console.log("answer:", sumActiveCubes());
  });

  it("2", () => {
    runInstructions(allInstructions);
    console.log("answer:", sumActiveCubes());
  });
});
