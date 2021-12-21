import { data } from "./inputData";

describe("day 1", () => {
  let workData: number[];

  beforeAll(() => {
    workData = data.split("\n").map((num) => +num);
  });

  it("1", () => {
    const increses = workData.reduce<number>(
      (prev, cur, i) => (i > 0 && cur > workData[i - 1] ? prev + 1 : prev),
      0
    );
    console.log("increses:", increses);
  });

  it.only("2", () => {
    const windowSums = workData.reduce<number[]>(
      (prev, cur, i) =>
        i < workData.length - 2
          ? [...prev, cur + workData[i + 1] + workData[i + 2]]
          : prev,
      []
    );
    const increses = windowSums.reduce<number>(
      (prev, cur, i) => (i > 0 && cur > windowSums[i - 1] ? prev + 1 : prev),
      0
    );
    console.log("increses:", increses);
  });
});
