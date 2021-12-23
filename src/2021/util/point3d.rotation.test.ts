import { point3dMatrixMultiply, matrixMultiply } from ".";

describe("rotation matrix tests", () => {
  it("no rotation", () => {
    expect(
      point3dMatrixMultiply({ x: 3, y: 2, z: 1 }, [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
      ])
    ).toEqual({ x: 3, y: 2, z: 1 });
  });

  it("roll 90", () => {
    expect(
      point3dMatrixMultiply({ x: 3, y: 2, z: 1 }, [
        [1, 0, 0],
        [0, 0, -1],
        [0, 1, 0],
      ])
    ).toEqual({ x: 3, y: -1, z: 2 });
  });

  it("roll 180", () => {
    expect(
      point3dMatrixMultiply(
        { x: 3, y: 2, z: 1 },
        matrixMultiply(
          [
            [1, 0, 0],
            [0, 0, -1],
            [0, 1, 0],
          ],
          [
            [1, 0, 0],
            [0, 0, -1],
            [0, 1, 0],
          ]
        )
      )
    ).toEqual({ x: 3, y: -2, z: -1 });
  });

  it("roll 90 pitch 90", () => {
    expect(
      point3dMatrixMultiply(
        { x: 3, y: 2, z: 1 },
        matrixMultiply(
          [
            [1, 0, 0],
            [0, 0, -1],
            [0, 1, 0],
          ],
          [
            [0, -1, 0],
            [1, 0, 0],
            [0, 0, 1],
          ]
        )
      )
    ).toEqual({ x: -2, y: -1, z: 3 });
  });

  it("yaw 90", () => {
    expect(
      point3dMatrixMultiply({ x: 3, y: 2, z: 1 }, [
        [0, 0, -1],
        [0, 1, 0],
        [1, 0, 0],
      ])
    ).toEqual({ x: -1, y: 2, z: 3 });
  });

  it("yaw 90 roll 90", () => {
    expect(
      point3dMatrixMultiply(
        { x: 3, y: 2, z: 1 },
        matrixMultiply(
          [
            [0, 0, -1],
            [0, 1, 0],
            [1, 0, 0],
          ],
          [
            [1, 0, 0],
            [0, 0, -1],
            [0, 1, 0],
          ]
        )
      )
    ).toEqual({ x: -2, y: -1, z: 3 });
  });
});
