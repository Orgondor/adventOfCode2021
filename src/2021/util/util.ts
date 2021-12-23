export const matrixTranspose = <T>(matrix: T[][]): T[][] => {
  return matrix[0].map((_, i) => matrix.map((_, j) => matrix[j][i]));
};
