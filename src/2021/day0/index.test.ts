import { data, testData } from "./inputData";

describe("day ", () => {
  let workData: number[];

  beforeAll(() => {
    workData = testData.split("\n").map((num) => +num);
  });

  it("1", () => {
    console.log(workData);
  });
});
