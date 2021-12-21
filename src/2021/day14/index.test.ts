import { data, testData } from "./inputData";

type Polymer = {
  startMaterial: string;
  endMaterial: string;
  pairs: Record<string, number>;
};

const insertMaterial = (
  polymer: Polymer,
  pairInsertions: Record<string, string[]>
) => {
  const startPairs = { ...polymer.pairs };
  Object.entries(startPairs).forEach(([pair, amount]) => {
    polymer.pairs[pair] -= amount;
    polymer.pairs[pairInsertions[pair][0]] += amount;
    polymer.pairs[pairInsertions[pair][1]] += amount;
  });
};

const countMaterial = (polymer: Polymer): Record<string, number> => {
  const counts: Record<string, number> = {};
  Object.entries(polymer.pairs).forEach(([pair, amount]) => {
    if (!counts[pair[0]]) {
      counts[pair[0]] = 0;
    }
    if (!counts[pair[1]]) {
      counts[pair[1]] = 0;
    }

    counts[pair[0]] += amount * 0.5;
    counts[pair[1]] += amount * 0.5;
  });
  counts[polymer.startMaterial] += 0.5;
  counts[polymer.endMaterial] += 0.5;
  return counts;
};

describe("day 14", () => {
  let polymer: Polymer;
  let startPolymer: string;
  const pairs: string[] = [];
  const pairInsertions: Record<string, string[]> = {};

  beforeAll(() => {
    const [sm, insertions] = data.split("\n\n");
    startPolymer = sm;

    insertions.split("\n").forEach((insertion) => {
      const [pair, insert] = insertion.split(" -> ");
      pairs.push(pair);
      pairInsertions[pair] = [pair[0] + insert, insert + pair[1]];
    });
  });

  beforeEach(() => {
    polymer = {
      startMaterial: startPolymer[0],
      endMaterial: startPolymer[startPolymer.length - 1],
      pairs: pairs.reduce<Record<string, number>>((prev, pair) => {
        prev[pair] = 0;
        return prev;
      }, {}),
    };
    [...startPolymer].forEach((material, i) => {
      if (i < startPolymer.length - 1) {
        polymer.pairs[material + startPolymer[i + 1]] += 1;
      }
    });
  });

  it("1", () => {
    for (let i = 0; i < 10; i++) {
      insertMaterial(polymer, pairInsertions);
    }
    const counts = Object.values(countMaterial(polymer));
    console.log("answer:", Math.max(...counts) - Math.min(...counts));
  });

  it.only("2", () => {
    for (let i = 0; i < 40; i++) {
      insertMaterial(polymer, pairInsertions);
    }
    const counts = Object.values(countMaterial(polymer));
    console.log("answer:", Math.max(...counts) - Math.min(...counts));
  });
});
