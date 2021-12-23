import { sum } from ".";

export type Matrix = number[][];

export const matrixMultiply = (a: Matrix, b: Matrix): Matrix => {
  if (a.length !== b[0].length || a[0].length !== b.length) {
    throw new Error("Matrix size missmatch");
  }

  const result: Matrix = [];
  a.forEach((_, i) => {
    result.push(
      b[0].map((_, j) => sum(...b.map((bVal, k) => bVal[j] * a[i][k])))
    );
  });

  return result;
};
