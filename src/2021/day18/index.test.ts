import { data, additionTestData, magnitudeTestData, Pair } from "./inputData";

type AddLeft = { func?: (add: number) => void };
type AddRight = (add: number) => void;
type WriteZero = () => void;

const createRightAdder = (basePair: Pair): AddRight => {
  return (add) => {
    if (typeof basePair[1] === "number") {
      basePair[1] += add;
      return;
    }

    const stepIn = (pair: Pair, add: number) => {
      if (typeof pair[0] === "number") {
        pair[0] += add;
        return;
      }
      stepIn(pair[0], add);
    };
    stepIn(basePair[1], add);
  };
};

const explode = (
  basePair: Pair,
  level = 0,
  writeZero: WriteZero = () => {
    return;
  },
  addLeft: AddLeft = {},
  addRight?: AddRight
): boolean => {
  if (level >= 4) {
    if (addLeft.func) {
      addLeft.func(basePair[0] as number);
    }
    if (addRight) {
      addRight(basePair[1] as number);
    }
    writeZero();
    return true;
  }

  const left = basePair[0];
  if (typeof left !== "number") {
    const exploded = explode(
      left,
      level + 1,
      () => (basePair[0] = 0),
      addLeft,
      createRightAdder(basePair)
    );
    if (exploded) {
      return true;
    }
  } else {
    addLeft.func = (add) => {
      basePair[0] = (basePair[0] as number) + add;
    };
  }

  const right = basePair[1];
  if (typeof right !== "number") {
    return explode(
      right,
      level + 1,
      () => (basePair[1] = 0),
      addLeft,
      addRight
    );
  } else {
    addLeft.func = (add) => {
      basePair[1] = (basePair[1] as number) + add;
    };
  }
  return false;
};

const split = (basePair: Pair): boolean => {
  if (typeof basePair[0] === "number") {
    if (basePair[0] > 9) {
      basePair[0] = [Math.floor(basePair[0] / 2), Math.ceil(basePair[0] / 2)];
      return true;
    }
  } else {
    const hasSplit = split(basePair[0]);
    if (hasSplit) {
      return true;
    }
  }

  if (typeof basePair[1] === "number") {
    if (basePair[1] > 9) {
      basePair[1] = [Math.floor(basePair[1] / 2), Math.ceil(basePair[1] / 2)];
      return true;
    }
  } else {
    return split(basePair[1]);
  }
  return false;
};

const reduce = (basePair: Pair) => {
  if (explode(basePair)) {
    return reduce(basePair);
  }
  if (split(basePair)) {
    return reduce(basePair);
  }
};

const addPairs = (a: Pair, b: Pair): Pair => {
  const result = [a, b];
  reduce(result);
  return result;
};

const calculateMagnitude = (input: Pair | number): number => {
  if (typeof input === "number") {
    return input;
  }

  return 3 * calculateMagnitude(input[0]) + 2 * calculateMagnitude(input[1]);
};

const copyPair = (pair: Pair): Pair => {
  const copy = (input: Pair | number): Pair | number => {
    if (typeof input === "number") {
      return input;
    }
    return input.map((part) => copy(part));
  };
  return pair.map((part) => copy(part));
};

describe("day 18", () => {
  let workData: Pair[];

  beforeAll(() => {
    workData = data.split("\n").map((pair) => JSON.parse(pair));
  });

  it.each(additionTestData)("addtion test", (caseData) => {
    expect.assertions(1);
    let result: Pair = caseData.additions[0];
    caseData.additions.forEach((pair, i) => {
      if (i > 0) {
        result = addPairs(result, pair);
      }
    });
    expect(result).toEqual(caseData.result);
  });

  it.each(magnitudeTestData)("magnitude test", (caseData) => {
    expect.assertions(1);
    const result = calculateMagnitude(caseData.pair);
    expect(result).toEqual(caseData.result);
  });

  it("1", () => {
    let additionResult: Pair = workData[0];
    workData.forEach((pair, i) => {
      if (i > 0) {
        additionResult = addPairs(additionResult, pair);
      }
    });

    console.log("answer:", calculateMagnitude(additionResult));
  });

  it.only("2", () => {
    let answer = 0;
    workData.forEach((pairA, i) => {
      workData.forEach((pairB, j) => {
        if (i !== j) {
          answer = Math.max(
            answer,
            calculateMagnitude(addPairs(copyPair(pairA), copyPair(pairB)))
          );
        }
      });
    });

    console.log("answer:", answer);
  });
});
