import { data } from "./inputData";
import { commonLetter } from "./funcs";

describe("day 3", () => {
  let workData: string[];

  beforeAll(() => {
    workData = data.split("\n");
  });

  it("1", () => {
    const numOnes: number[] = [];
    let common = "";
    let uncommon = "";

    workData.forEach((num, i) => {
      const digits = workData[i].length;
      [...num].forEach((digit, i) => {
        if (numOnes.length <= i) {
          numOnes.push(0);
        }
        numOnes[i] += +digit;
      });
    });

    numOnes.forEach((num) => {
      const c = num > workData.length / 2 ? "1" : "0";
      const u = c === "0" ? "1" : "0";
      common += c;
      uncommon += u;
    });

    console.log("common:", common);
    console.log("uncommon:", uncommon);
    const gamma = parseInt(common, 2);
    const epsilon = parseInt(uncommon, 2);

    console.log("gamma:", gamma);
    console.log("epsilon:", epsilon);
    console.log("consumption:", gamma * epsilon);
  });

  it.only("2", () => {
    const numOnes: number[] = [];
    let common: string[] = [...workData];
    let uncommon: string[] = [...workData];

    [...workData[0]].forEach((_, i) => {
      if (common.length > 1) {
        const cLetter = commonLetter(common, i, "1");
        common = common.filter((str) => [...str][i] === cLetter);
      }

      if (uncommon.length > 1) {
        const cLetter = commonLetter(uncommon, i, "1");
        const uLetter = cLetter === "1" ? "0" : "1";
        const tmp = uncommon.filter((str) => [...str][i] === uLetter);
        if (tmp.length) {
          uncommon = tmp;
        }
      }
    });

    console.log("common:", common);
    console.log("uncommon:", uncommon);
    const oxygenGen = parseInt(common[0], 2);
    const CO2Scrubb = parseInt(uncommon[0], 2);

    console.log("oxygenGen:", oxygenGen);
    console.log("CO2Scrubb:", CO2Scrubb);
    console.log("life support rating:", oxygenGen * CO2Scrubb);
  });
});
