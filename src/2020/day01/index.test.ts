import { data } from "./inputData";

describe("day 1", () => {
  let workData: number[];

  beforeAll(() => {
    workData = data.split("\n").map((num) => +num);
  });

  it("1", () => {
    workData.find((num1, i) => {
      const num2 = workData.find((num2, j) => i !== j && num1 + num2 === 2020);
      if (num2) {
        console.log("answer 1:", num1 * num2);
      }
      return num2;
    });
  });

  it("2", () => {
    workData.find((num1, i) =>
      workData.find((num2, j) => {
        if (i === j || num1 + num2 >= 2020) {
          return false;
        }
        const num3 = workData.find(
          (num3, k) => i !== k && j !== k && num1 + num2 + num3 === 2020
        );
        if (num3) {
          console.log("answer 2:", num1 * num2 * num3);
        }
        return num3;
      })
    );
  });
});
