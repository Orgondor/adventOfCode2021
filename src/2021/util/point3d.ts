import { Matrix, matrixMultiply, matrixTranspose, sum } from ".";

export type Point3d = {
  x: number;
  y: number;
  z: number;
};

export const point3dToArray = (point: Point3d): number[] => {
  return [point.x, point.y, point.z];
};

export const point3dFromArray = (point: number[]): Point3d => {
  if (point.length !== 3) {
    throw new Error("invalid input array");
  }
  return {
    x: point[0],
    y: point[1],
    z: point[2],
  };
};

export const point3dMatrixMultiply = (
  point: Point3d,
  matrix: Matrix
): Point3d => {
  if (matrix.length !== 3 || matrix[0].length !== 3) {
    throw new Error("Non-3x3-matirx");
  }
  return {
    x: point.x * matrix[0][0] + point.y * matrix[0][1] + point.z * matrix[0][2],
    y: point.x * matrix[1][0] + point.y * matrix[1][1] + point.z * matrix[1][2],
    z: point.x * matrix[2][0] + point.y * matrix[2][1] + point.z * matrix[2][2],
  };
};

export const point3dAdd = (a: Point3d, b: Point3d): Point3d => {
  return {
    x: a.x + b.x,
    y: a.y + b.y,
    z: a.z + b.z,
  };
};

export const point3dSubtract = (a: Point3d, b: Point3d): Point3d => {
  return {
    x: a.x - b.x,
    y: a.y - b.y,
    z: a.z - b.z,
  };
};

export const point3dScale = (point: Point3d, scale: number): Point3d => {
  return {
    x: point.x * scale,
    y: point.y * scale,
    z: point.z * scale,
  };
};

export const point3dLength = (point: Point3d): number => {
  return Math.sqrt(dot(point, point));
};

export const point3dManhattanLength = (point: Point3d): number => {
  return Math.abs(point.x) + Math.abs(point.y) + Math.abs(point.z);
};

export const point3dNormalize = (point: Point3d): Point3d => {
  return point3dScale(point, 1 / point3dLength(point));
};

export const point3dEqual = (a: Point3d, b: Point3d): boolean => {
  return a.x === b.x && a.y === b.y && a.z === b.z;
};

export const point3dToString = (point: Point3d): string => {
  return `${point.x},${point.y},${point.z}`;
};

export const dot = (a: Point3d, b: Point3d): number => {
  return a.x * b.x + a.y * b.y + a.z * b.z;
};

export const cross = (a: Point3d, b: Point3d): Point3d => {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  };
};
