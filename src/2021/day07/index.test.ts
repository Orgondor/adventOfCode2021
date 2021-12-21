import { data, testData } from "./inputData";

describe("day 7", () => {
  let crabsPerPlace: number[];

  beforeAll(() => {
    const placements = data.split(",").map((num) => +num);
    const numPlaces = Math.max(...placements) + 1;
    crabsPerPlace = [...Array(numPlaces)].map(() => 0);
    placements.forEach((placement) => {
      crabsPerPlace[placement] += 1;
    });
  });

  it("1", () => {
    const travelCosts = [...Array(crabsPerPlace.length)].map(() => 0);
    travelCosts.forEach((_, i) => {
      travelCosts[i] = crabsPerPlace.reduce<number>((prev, numCrabs, j) => {
        return prev + numCrabs * Math.abs(i - j);
      }, 0);
    });
    console.log("Minimum travel cost:", Math.min(...travelCosts));
  });

  it.only("2", () => {
    const travelCostForDistance = [...Array(crabsPerPlace.length)].map(() => 0);
    travelCostForDistance.forEach((_, i) => {
      if (i > 0) {
        travelCostForDistance[i] = travelCostForDistance[i - 1] + i;
      }
    });
    const travelCosts = [...Array(crabsPerPlace.length)].map(() => 0);
    travelCosts.forEach((_, i) => {
      travelCosts[i] = crabsPerPlace.reduce<number>((prev, numCrabs, j) => {
        return prev + numCrabs * travelCostForDistance[Math.abs(i - j)];
      }, 0);
    });
    console.log("Minimum travel cost:", Math.min(...travelCosts));
  });
});
