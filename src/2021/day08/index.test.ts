import { data, testData } from "./inputData";

const letterToBinary: Record<string, number> = {
  a: 0b0000001,
  b: 0b0000010,
  c: 0b0000100,
  d: 0b0001000,
  e: 0b0010000,
  f: 0b0100000,
  g: 0b1000000,
};

const segmentsToBinary = (segments: string) => {
  return [...segments]
    .map((letter) => letterToBinary[letter])
    .reduce<number>((prev, cur) => prev | cur, 0);
};

type Display = {
  input: string[];
  output: string[];
  binaryInput: number[];
  binaryOutput: number[];
  binaryDigitMap: Record<number, string>;
  digitBinaryMap: Record<string, number>;
};

const uniqueNumSegments = [2, 3, 4, 7];
const correspondingDigit = ["1", "7", "4", "8"];

const mapInputToDigit = (display: Display) => {
  const remaining = display.binaryInput.filter((binary, i) => {
    const uId = uniqueNumSegments.findIndex(
      (val) => display.input[i].length === val
    );
    if (uId >= 0) {
      display.binaryDigitMap[binary] = correspondingDigit[uId];
      display.digitBinaryMap[correspondingDigit[uId]] = binary;
      return false;
    }
    return true;
  });

  //  aaaa
  // b    c
  // b    c
  //  dddd
  // e    f
  // e    f
  //  gggg

  const bd = display.digitBinaryMap["1"] ^ display.digitBinaryMap["4"];
  const binary03 = remaining.filter((binary) => {
    const is023 = (binary & bd) !== 0 && (binary & bd) !== bd;
    if (is023) {
      const is2 =
        (binary & display.digitBinaryMap["1"]) !== display.digitBinaryMap["1"];
      if (is2) {
        display.binaryDigitMap[binary] = "2";
        display.digitBinaryMap["2"] = binary;
        return false;
      }
      return true;
    }
    return false;
  });

  const d = display.digitBinaryMap["2"] & bd;
  const b = d ^ bd;
  const c = display.digitBinaryMap["1"] & display.digitBinaryMap["2"];
  const f = display.digitBinaryMap["1"] ^ c;
  const a = (display.digitBinaryMap["2"] & display.digitBinaryMap["7"]) ^ c;

  binary03.forEach((binary) => {
    if (binary & d) {
      display.binaryDigitMap[binary] = "3";
      display.digitBinaryMap["3"] = binary;
      return;
    }
    display.binaryDigitMap[binary] = "0";
    display.digitBinaryMap["0"] = binary;
  });

  const abcf = a | b | c | f;
  const eg = display.digitBinaryMap["0"] ^ abcf;
  const g = display.digitBinaryMap["3"] & eg;
  const e = g ^ eg;

  display.binaryDigitMap[a | b | d | f | g] = "5";
  display.digitBinaryMap["5"] = a | b | d | f | g;

  display.binaryDigitMap[a | b | d | e | f | g] = "6";
  display.digitBinaryMap["6"] = a | b | d | e | f | g;

  display.binaryDigitMap[a | b | c | d | f | g] = "9";
  display.digitBinaryMap["9"] = a | b | c | d | f | g;
};

describe("day 8", () => {
  let displays: Display[];

  beforeAll(() => {
    displays = data.split("\n").map((row): Display => {
      const splitRow = row.split(" | ");
      const input = splitRow[0].split(" ");
      const binaryInput = input.map((segments): number =>
        [...segments]
          .map((letter) => letterToBinary[letter])
          .reduce<number>((prev, cur) => prev | cur, 0)
      );
      const output = splitRow[1].split(" ");
      const binaryOutout = output.map((segments): number =>
        segmentsToBinary(segments)
      );
      return {
        input,
        output,
        binaryInput,
        binaryOutput: binaryOutout,
        binaryDigitMap: {},
        digitBinaryMap: {},
      };
    });
  });

  it("1", () => {
    const sum = displays.reduce<number>(
      (prev, display) =>
        prev +
        display.output
          .map((digit) => digit.length)
          .filter((len) => uniqueNumSegments.includes(len)).length,
      0
    );

    console.log("answer:", sum);
  });

  it.only("2", () => {
    displays.forEach((display) => {
      mapInputToDigit(display);
    });

    console.log(displays[0].binaryDigitMap);

    const sum = displays.reduce<number>(
      (prev, display) =>
        prev +
        +display.binaryOutput.reduce<string>(
          (prev, binaryOutput) => prev + display.binaryDigitMap[binaryOutput],
          ""
        ),
      0
    );

    console.log("answer:", sum);
  });
});
