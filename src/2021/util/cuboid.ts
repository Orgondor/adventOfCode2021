import { Point3d, point3dAdd, point3dSubtract } from ".";

export type Cuboid = {
  from: Point3d;
  to: Point3d;
};

export const removeCuboid = (remove: Cuboid, from: Cuboid): Cuboid[] => {
  const result: Cuboid[] = [];

  const removeMinusFrom = point3dSubtract(remove.to, from.from);
  const fromMinusRemove = point3dSubtract(from.to, remove.from);
  const intersected = [false, false, false];
  let addedXend = false;
  let addedXStart = false;
  let addedYend = false;
  let addedYStart = false;

  if (removeMinusFrom.x >= 0) {
    if (remove.from.x <= from.from.x) {
      intersected[0] = true;
    }

    if (remove.to.x < from.to.x) {
      result.push({
        from: { ...from.from, x: remove.to.x + 1 },
        to: from.to,
      });
      addedXend = true;
    }
  }

  if (fromMinusRemove.x >= 0) {
    if (from.from.x <= remove.from.x) {
      intersected[0] = true;
    }

    if (from.from.x < remove.from.x) {
      result.push({
        from: from.from,
        to: { ...from.to, x: remove.from.x - 1 },
      });
      addedXStart = true;
    }
  }

  if (removeMinusFrom.y >= 0) {
    if (remove.from.y <= from.from.y) {
      intersected[1] = true;
    }

    if (remove.to.y < from.to.y) {
      result.push({
        from: {
          x: addedXStart ? remove.from.x : from.from.x,
          y: remove.to.y + 1,
          z: from.from.z,
        },
        to: { ...from.to, x: addedXend ? remove.to.x : from.to.x },
      });
      addedYend = true;
    }
  }

  if (fromMinusRemove.y >= 0) {
    if (from.from.y <= remove.from.y) {
      intersected[1] = true;
    }

    if (from.from.y < remove.from.y) {
      result.push({
        from: { ...from.from, x: addedXStart ? remove.from.x : from.from.x },
        to: {
          x: addedXend ? remove.to.x : from.to.x,
          y: remove.from.y - 1,
          z: from.to.z,
        },
      });
      addedYStart = true;
    }
  }

  if (removeMinusFrom.z >= 0) {
    if (remove.from.z <= from.from.z) {
      intersected[2] = true;
    }

    if (remove.to.z < from.to.z) {
      result.push({
        from: {
          x: addedXStart ? remove.from.x : from.from.x,
          y: addedYStart ? remove.from.y : from.from.y,
          z: remove.to.z + 1,
        },
        to: {
          x: addedXend ? remove.to.x : from.to.x,
          y: addedYend ? remove.to.y : from.to.y,
          z: from.to.z,
        },
      });
    }
  }

  if (fromMinusRemove.z >= 0) {
    if (from.from.z <= remove.from.z) {
      intersected[2] = true;
    }

    if (from.from.z < remove.from.z) {
      result.push({
        from: {
          x: addedXStart ? remove.from.x : from.from.x,
          y: addedYStart ? remove.from.y : from.from.y,
          z: from.from.z,
        },
        to: {
          x: addedXend ? remove.to.x : from.to.x,
          y: addedYend ? remove.to.y : from.to.y,
          z: remove.from.z - 1,
        },
      });
    }
  }

  return intersected[0] && intersected[1] && intersected[2] ? result : [from];
};

export const getCuboidIntersection = (
  a: Cuboid,
  b: Cuboid
): Cuboid | undefined => {
  const aMinusB = point3dSubtract(a.to, b.from);
  const bMinusA = point3dSubtract(b.to, a.from);
  const intersected = [false, false, false];
  const intersection: Cuboid = {
    from: { x: 0, y: 0, z: 0 },
    to: { x: 0, y: 0, z: 0 },
  };

  if (aMinusB.x >= 0 && a.from.x <= b.from.x) {
    intersected[0] = true;
    intersection.from.x = b.from.x;
    intersection.to.x = Math.min(a.to.x, b.to.x);
  } else if (bMinusA.x >= 0 && b.from.x <= a.from.x) {
    intersected[0] = true;
    intersection.from.x = a.from.x;
    intersection.to.x = Math.min(a.to.x, b.to.x);
  }

  if (aMinusB.y >= 0 && a.from.y <= b.from.y) {
    intersected[1] = true;
    intersection.from.y = b.from.y;
    intersection.to.y = Math.min(a.to.y, b.to.y);
  } else if (bMinusA.y >= 0 && b.from.y <= a.from.y) {
    intersected[1] = true;
    intersection.from.y = a.from.y;
    intersection.to.y = Math.min(a.to.y, b.to.y);
  }

  if (aMinusB.z >= 0 && a.from.z <= b.from.z) {
    intersected[2] = true;
    intersection.from.z = b.from.z;
    intersection.to.z = Math.min(a.to.z, b.to.z);
  } else if (bMinusA.z >= 0 && b.from.z <= a.from.z) {
    intersected[2] = true;
    intersection.from.z = a.from.z;
    intersection.to.z = Math.min(a.to.z, b.to.z);
  }

  return intersected[0] && intersected[1] && intersected[2]
    ? intersection
    : undefined;
};

export const getNumCubes = (cuboid: Cuboid): number => {
  const dimensions = point3dAdd(point3dSubtract(cuboid.to, cuboid.from), {
    x: 1,
    y: 1,
    z: 1,
  });
  return dimensions.x * dimensions.y * dimensions.z;
};
