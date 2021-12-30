import {
  Cuboid,
  getCuboidIntersection,
  getNumCubes,
  point3dAdd,
  point3dSubtract,
  removeCuboid,
} from ".";

type IntersectionTestCase = {
  a: Cuboid;
  b: Cuboid;
  expected: Cuboid | undefined;
};

const intersectionTestCases: IntersectionTestCase[] = [
  {
    a: { from: { x: 1, y: 1, z: 1 }, to: { x: 9, y: 9, z: 9 } },
    b: { from: { x: 1, y: 1, z: 1 }, to: { x: 9, y: 9, z: 9 } },
    expected: { from: { x: 1, y: 1, z: 1 }, to: { x: 9, y: 9, z: 9 } },
  },
  {
    a: { from: { x: 1, y: 1, z: 1 }, to: { x: 9, y: 9, z: 9 } },
    b: { from: { x: 9, y: 9, z: 9 }, to: { x: 10, y: 10, z: 10 } },
    expected: { from: { x: 9, y: 9, z: 9 }, to: { x: 9, y: 9, z: 9 } },
  },
  {
    a: { from: { x: 1, y: 1, z: 1 }, to: { x: 9, y: 9, z: 9 } },
    b: { from: { x: -2, y: -2, z: -2 }, to: { x: 5, y: 6, z: 7 } },
    expected: { from: { x: 1, y: 1, z: 1 }, to: { x: 5, y: 6, z: 7 } },
  },
  {
    a: { from: { x: -1, y: -1, z: -1 }, to: { x: 9, y: 9, z: 9 } },
    b: { from: { x: -4, y: 2, z: -4 }, to: { x: -2, y: 6, z: -2 } },
    expected: undefined,
  },
  {
    a: { from: { x: -1, y: -1, z: -1 }, to: { x: 9, y: 9, z: 9 } },
    b: { from: { x: -4, y: 2, z: -4 }, to: { x: -2, y: 6, z: 7 } },
    expected: undefined,
  },
  {
    a: { from: { x: -1, y: -1, z: -1 }, to: { x: 9, y: 9, z: 9 } },
    b: { from: { x: 3, y: 2, z: -4 }, to: { x: 5, y: 6, z: 7 } },
    expected: { from: { x: 3, y: 2, z: -1 }, to: { x: 5, y: 6, z: 7 } },
  },
  {
    a: { from: { x: -1, y: -1, z: -1 }, to: { x: 9, y: 9, z: 9 } },
    b: { from: { x: 3, y: 2, z: 5 }, to: { x: 5, y: 6, z: 7 } },
    expected: { from: { x: 3, y: 2, z: 5 }, to: { x: 5, y: 6, z: 7 } },
  },
  {
    a: { from: { x: 1, y: 1, z: 1 }, to: { x: 9, y: 9, z: 9 } },
    b: { from: { x: 10, y: 10, z: 10 }, to: { x: 10, y: 10, z: 10 } },
    expected: undefined,
  },
];

type RemoveTestCase = {
  remove: Cuboid;
  from: Cuboid;
  expected: Cuboid[] | undefined;
};

const removeTestCases: RemoveTestCase[] = [
  {
    remove: { from: { x: 1, y: 1, z: 1 }, to: { x: 9, y: 9, z: 9 } },
    from: { from: { x: 1, y: 1, z: 1 }, to: { x: 9, y: 9, z: 9 } },
    expected: [],
  },
  {
    remove: { from: { x: 1, y: 1, z: 1 }, to: { x: 1, y: 1, z: 1 } },
    from: { from: { x: 0, y: 0, z: 0 }, to: { x: 2, y: 2, z: 2 } },
    expected: [
      { from: { x: 2, y: 0, z: 0 }, to: { x: 2, y: 2, z: 2 } },
      { from: { x: 0, y: 0, z: 0 }, to: { x: 0, y: 2, z: 2 } },
      { from: { x: 1, y: 2, z: 0 }, to: { x: 1, y: 2, z: 2 } },
      { from: { x: 1, y: 0, z: 0 }, to: { x: 1, y: 0, z: 2 } },
      { from: { x: 1, y: 1, z: 2 }, to: { x: 1, y: 1, z: 2 } },
      { from: { x: 1, y: 1, z: 0 }, to: { x: 1, y: 1, z: 0 } },
    ],
  },
  {
    remove: { from: { x: 9, y: 9, z: 9 }, to: { x: 10, y: 10, z: 10 } },
    from: { from: { x: 1, y: 1, z: 1 }, to: { x: 9, y: 9, z: 9 } },
    expected: [
      { from: { x: 1, y: 1, z: 1 }, to: { x: 8, y: 9, z: 9 } },
      { from: { x: 9, y: 1, z: 1 }, to: { x: 9, y: 8, z: 9 } },
      { from: { x: 9, y: 9, z: 1 }, to: { x: 9, y: 9, z: 8 } },
    ],
  },
  {
    remove: { from: { x: -2, y: -2, z: -2 }, to: { x: 5, y: 6, z: 7 } },
    from: { from: { x: 1, y: 1, z: 1 }, to: { x: 9, y: 9, z: 9 } },
    expected: [
      { from: { x: 6, y: 1, z: 1 }, to: { x: 9, y: 9, z: 9 } },
      { from: { x: 1, y: 7, z: 1 }, to: { x: 5, y: 9, z: 9 } },
      { from: { x: 1, y: 1, z: 8 }, to: { x: 5, y: 6, z: 9 } },
    ],
  },
  {
    remove: { from: { x: -4, y: 2, z: -4 }, to: { x: -2, y: 6, z: -2 } },
    from: { from: { x: -1, y: -1, z: -1 }, to: { x: 9, y: 9, z: 9 } },
    expected: [{ from: { x: -1, y: -1, z: -1 }, to: { x: 9, y: 9, z: 9 } }],
  },
  {
    remove: { from: { x: -4, y: 2, z: -4 }, to: { x: -2, y: 6, z: 7 } },
    from: { from: { x: -1, y: -1, z: -1 }, to: { x: 9, y: 9, z: 9 } },
    expected: [{ from: { x: -1, y: -1, z: -1 }, to: { x: 9, y: 9, z: 9 } }],
  },
  {
    remove: { from: { x: 3, y: 2, z: -4 }, to: { x: 5, y: 6, z: 7 } },
    from: { from: { x: -1, y: -1, z: -1 }, to: { x: 9, y: 9, z: 9 } },
    expected: [
      { from: { x: 6, y: -1, z: -1 }, to: { x: 9, y: 9, z: 9 } },
      { from: { x: -1, y: -1, z: -1 }, to: { x: 2, y: 9, z: 9 } },
      { from: { x: 3, y: 7, z: -1 }, to: { x: 5, y: 9, z: 9 } },
      { from: { x: 3, y: -1, z: -1 }, to: { x: 5, y: 1, z: 9 } },
      { from: { x: 3, y: 2, z: 8 }, to: { x: 5, y: 6, z: 9 } },
    ],
  },
  {
    remove: { from: { x: 10, y: 10, z: 10 }, to: { x: 10, y: 10, z: 10 } },
    from: { from: { x: 1, y: 1, z: 1 }, to: { x: 9, y: 9, z: 9 } },
    expected: [{ from: { x: 1, y: 1, z: 1 }, to: { x: 9, y: 9, z: 9 } }],
  },
];

type CubesTestCase = {
  remove: Cuboid;
  from: Cuboid;
  expected: number;
};

const cubeTestCases: CubesTestCase[] = [
  {
    remove: { from: { x: 0, y: 0, z: 0 }, to: { x: 0, y: 0, z: 0 } },
    from: { from: { x: 0, y: 0, z: 0 }, to: { x: 2, y: 2, z: 2 } },
    expected: 26,
  },
  {
    remove: { from: { x: 0, y: 1, z: 0 }, to: { x: 0, y: 1, z: 0 } },
    from: { from: { x: 0, y: 0, z: 0 }, to: { x: 2, y: 2, z: 2 } },
    expected: 26,
  },
  {
    remove: { from: { x: 0, y: 2, z: 0 }, to: { x: 0, y: 2, z: 0 } },
    from: { from: { x: 0, y: 0, z: 0 }, to: { x: 2, y: 2, z: 2 } },
    expected: 26,
  },
  {
    remove: { from: { x: 0, y: 0, z: 1 }, to: { x: 0, y: 0, z: 1 } },
    from: { from: { x: 0, y: 0, z: 0 }, to: { x: 2, y: 2, z: 2 } },
    expected: 26,
  },
  {
    remove: { from: { x: 0, y: 0, z: 2 }, to: { x: 0, y: 0, z: 2 } },
    from: { from: { x: 0, y: 0, z: 0 }, to: { x: 2, y: 2, z: 2 } },
    expected: 26,
  },
  {
    remove: { from: { x: 0, y: 1, z: 1 }, to: { x: 0, y: 1, z: 1 } },
    from: { from: { x: 0, y: 0, z: 0 }, to: { x: 2, y: 2, z: 2 } },
    expected: 26,
  },
  {
    remove: { from: { x: 0, y: 1, z: 2 }, to: { x: 0, y: 1, z: 2 } },
    from: { from: { x: 0, y: 0, z: 0 }, to: { x: 2, y: 2, z: 2 } },
    expected: 26,
  },
  {
    remove: { from: { x: 0, y: 2, z: 2 }, to: { x: 0, y: 2, z: 2 } },
    from: { from: { x: 0, y: 0, z: 0 }, to: { x: 2, y: 2, z: 2 } },
    expected: 26,
  },
  {
    remove: { from: { x: 0, y: 2, z: 1 }, to: { x: 0, y: 2, z: 1 } },
    from: { from: { x: 0, y: 0, z: 0 }, to: { x: 2, y: 2, z: 2 } },
    expected: 26,
  },
  {
    remove: { from: { x: 1, y: 0, z: 0 }, to: { x: 1, y: 0, z: 0 } },
    from: { from: { x: 0, y: 0, z: 0 }, to: { x: 2, y: 2, z: 2 } },
    expected: 26,
  },
  {
    remove: { from: { x: 1, y: 1, z: 0 }, to: { x: 1, y: 1, z: 0 } },
    from: { from: { x: 0, y: 0, z: 0 }, to: { x: 2, y: 2, z: 2 } },
    expected: 26,
  },
  {
    remove: { from: { x: 1, y: 2, z: 0 }, to: { x: 1, y: 2, z: 0 } },
    from: { from: { x: 0, y: 0, z: 0 }, to: { x: 2, y: 2, z: 2 } },
    expected: 26,
  },
  {
    remove: { from: { x: 1, y: 0, z: 1 }, to: { x: 1, y: 0, z: 1 } },
    from: { from: { x: 0, y: 0, z: 0 }, to: { x: 2, y: 2, z: 2 } },
    expected: 26,
  },
  {
    remove: { from: { x: 1, y: 0, z: 2 }, to: { x: 1, y: 0, z: 2 } },
    from: { from: { x: 0, y: 0, z: 0 }, to: { x: 2, y: 2, z: 2 } },
    expected: 26,
  },
  {
    remove: { from: { x: 1, y: 1, z: 1 }, to: { x: 1, y: 1, z: 1 } },
    from: { from: { x: 0, y: 0, z: 0 }, to: { x: 2, y: 2, z: 2 } },
    expected: 26,
  },
  {
    remove: { from: { x: 1, y: 1, z: 2 }, to: { x: 1, y: 1, z: 2 } },
    from: { from: { x: 0, y: 0, z: 0 }, to: { x: 2, y: 2, z: 2 } },
    expected: 26,
  },
  {
    remove: { from: { x: 1, y: 2, z: 2 }, to: { x: 1, y: 2, z: 2 } },
    from: { from: { x: 0, y: 0, z: 0 }, to: { x: 2, y: 2, z: 2 } },
    expected: 26,
  },
  {
    remove: { from: { x: 1, y: 2, z: 1 }, to: { x: 1, y: 2, z: 1 } },
    from: { from: { x: 0, y: 0, z: 0 }, to: { x: 2, y: 2, z: 2 } },
    expected: 26,
  },
  {
    remove: { from: { x: 2, y: 0, z: 0 }, to: { x: 2, y: 0, z: 0 } },
    from: { from: { x: 0, y: 0, z: 0 }, to: { x: 2, y: 2, z: 2 } },
    expected: 26,
  },
  {
    remove: { from: { x: 2, y: 1, z: 0 }, to: { x: 2, y: 1, z: 0 } },
    from: { from: { x: 0, y: 0, z: 0 }, to: { x: 2, y: 2, z: 2 } },
    expected: 26,
  },
  {
    remove: { from: { x: 2, y: 2, z: 0 }, to: { x: 2, y: 2, z: 0 } },
    from: { from: { x: 0, y: 0, z: 0 }, to: { x: 2, y: 2, z: 2 } },
    expected: 26,
  },
  {
    remove: { from: { x: 2, y: 0, z: 1 }, to: { x: 2, y: 0, z: 1 } },
    from: { from: { x: 0, y: 0, z: 0 }, to: { x: 2, y: 2, z: 2 } },
    expected: 26,
  },
  {
    remove: { from: { x: 2, y: 0, z: 2 }, to: { x: 2, y: 0, z: 2 } },
    from: { from: { x: 0, y: 0, z: 0 }, to: { x: 2, y: 2, z: 2 } },
    expected: 26,
  },
  {
    remove: { from: { x: 2, y: 1, z: 1 }, to: { x: 2, y: 1, z: 1 } },
    from: { from: { x: 0, y: 0, z: 0 }, to: { x: 2, y: 2, z: 2 } },
    expected: 26,
  },
  {
    remove: { from: { x: 2, y: 1, z: 2 }, to: { x: 2, y: 1, z: 2 } },
    from: { from: { x: 0, y: 0, z: 0 }, to: { x: 2, y: 2, z: 2 } },
    expected: 26,
  },
  {
    remove: { from: { x: 2, y: 2, z: 2 }, to: { x: 2, y: 2, z: 2 } },
    from: { from: { x: 0, y: 0, z: 0 }, to: { x: 2, y: 2, z: 2 } },
    expected: 26,
  },
  {
    remove: { from: { x: 2, y: 2, z: 1 }, to: { x: 2, y: 2, z: 1 } },
    from: { from: { x: 0, y: 0, z: 0 }, to: { x: 2, y: 2, z: 2 } },
    expected: 26,
  },
];

describe("Cuboid tests", () => {
  it.each(intersectionTestCases)("Intersection test", (testCase) => {
    const intersection = getCuboidIntersection(testCase.a, testCase.b);
    expect(intersection).toEqual(testCase.expected);
  });

  it.each(removeTestCases)("Remove test", (testCase) => {
    const newCuboids = removeCuboid(testCase.remove, testCase.from);
    expect(newCuboids).toEqual(testCase.expected);
  });

  it.each(cubeTestCases)("Cube test", (testCase) => {
    const newCuboids = removeCuboid(testCase.remove, testCase.from);

    let sum = 0;
    newCuboids.forEach((cuboid) => {
      sum += getNumCubes(cuboid);
    });

    expect(sum).toEqual(testCase.expected);
  });
});
