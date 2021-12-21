import { data, testData } from "./inputData";

describe("day 6", () => {
  let populationState: number[];

  beforeAll(() => {
    populationState = [...Array(9)].map(() => 0);
    data.split(",").forEach((num) => {
      populationState[+num] += 1;
    });
  });

  it("1", () => {
    const days = 80;
    [...Array(days)].forEach((_, i) => {
      const newFish = populationState.shift();
      populationState.push(newFish);
      populationState[6] += newFish;
    });
    console.log(
      `After ${days} day, population:`,
      populationState.reduce<number>((prev, num) => prev + num, 0)
    );
  });

  it.only("2", () => {
    const days = 256;
    [...Array(days)].forEach((_, i) => {
      const newFish = populationState.shift();
      populationState.push(newFish);
      populationState[6] += newFish;
    });
    console.log(
      `After ${days} day, population:`,
      populationState.reduce<number>((prev, num) => prev + num, 0)
    );
  });
});
