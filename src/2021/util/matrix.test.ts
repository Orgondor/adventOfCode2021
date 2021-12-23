import { matrixMultiply, matrixTranspose } from ".";

describe("matrix tests", () => {
  describe("matix transpose", () => {
    it("single row", () => {
      expect(matrixTranspose([[1, 2, 3]])).toEqual([[1], [2], [3]]);
    });

    it("multiple rows", () => {
      expect(
        matrixTranspose([
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
          [1, 2, 3],
        ])
      ).toEqual([
        [1, 4, 7, 1],
        [2, 5, 8, 2],
        [3, 6, 9, 3],
      ]);
    });
  });

  describe("matix multiply", () => {
    it("missmatch", () => {
      expect(() =>
        matrixMultiply(
          [
            [0, 1],
            [0, 0],
          ],
          [[0, 0, 1]]
        )
      ).toThrow(new Error("Matrix size missmatch"));
    });

    it("Non-commutativity 1", () => {
      expect(
        matrixMultiply(
          [
            [0, 1],
            [0, 0],
          ],
          [
            [0, 0],
            [1, 0],
          ]
        )
      ).toEqual([
        [1, 0],
        [0, 0],
      ]);
    });

    it("Non-commutativity 2", () => {
      expect(
        matrixMultiply(
          [
            [0, 0],
            [1, 0],
          ],
          [
            [0, 1],
            [0, 0],
          ]
        )
      ).toEqual([
        [0, 0],
        [0, 1],
      ]);
    });

    it("Non-symetric", () => {
      expect(
        matrixMultiply(
          [
            [1, 0],
            [0, 2],
            [3, 3],
          ],
          [
            [1, 2, 3],
            [4, 5, 6],
          ]
        )
      ).toEqual([
        [1, 2, 3],
        [8, 10, 12],
        [15, 21, 27],
      ]);
    });
  });
});
