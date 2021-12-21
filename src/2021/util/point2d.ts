export type Point2d = {
  x: number;
  y: number;
};

export const point2dAdd = (a: Point2d, b: Point2d): Point2d => {
  return {
    x: a.x + b.x,
    y: a.y + b.y,
  };
};

export const point2dSubtract = (a: Point2d, b: Point2d): Point2d => {
  return {
    x: a.x - b.x,
    y: a.y - b.y,
  };
};

export const point2dEqual = (a: Point2d, b: Point2d): boolean => {
  return a.x === b.x && a.y === b.y;
};

export const point2dToString = (point: Point2d): string => {
  return `${point.x},${point.y}`;
};

const offsets = [-1, 1];

export const getNeighbourPoints = (
  gridSize: Point2d,
  pos: Point2d,
  ortogonal = true
): Point2d[] => {
  const neighbours: Point2d[] = [];
  offsets.forEach((offset) => {
    const x = pos.x + offset;
    const y = pos.y;
    if (x >= 0 && x < gridSize.x) {
      neighbours.push({ x, y });
    }
  });
  offsets.forEach((offset) => {
    const x = pos.x;
    const y = pos.y + offset;
    if (y >= 0 && y < gridSize.y) {
      neighbours.push({ x, y });
    }
  });
  return neighbours;
};
