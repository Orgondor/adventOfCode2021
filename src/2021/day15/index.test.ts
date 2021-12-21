import { data, testData } from "./inputData";
import { getNeighbourPoints, Point2d, point2dToString } from "../util";

type OpenNode = {
  pos: Point2d;
  posStr: string;
  cost: number;
};

type Path = {
  path: Point2d[];
  cost: number;
};

const reconstructPath = (
  cameFrom: Record<string, Point2d>,
  pos: Point2d
): Point2d[] => {
  const path = [pos];
  let current = point2dToString(pos);
  while (cameFrom[current]) {
    const curPos = cameFrom[current];
    current = point2dToString(curPos);
    path.unshift(curPos);
  }
  return path;
};

const cheapestPossiblePath = (pos: Point2d, goal: Point2d): number => {
  return goal.x - pos.x + (goal.y - pos.y);
};

const aStar = (start: Point2d, goal: Point2d, map: number[][]): Path => {
  const startStr = point2dToString(start);
  const goalStr = point2dToString(goal);
  const openNodes: OpenNode[] = [{ pos: start, posStr: startStr, cost: 0 }];
  const cameFrom: Record<string, Point2d> = {};
  const pathCost: Record<string, number> = {};
  const fullCost: Record<string, number> = {};
  pathCost[startStr] = 0;
  fullCost[startStr] = cheapestPossiblePath(start, goal);

  while (openNodes.length) {
    const currentNode = openNodes.shift();

    if (currentNode.posStr === goalStr) {
      return {
        path: reconstructPath(cameFrom, goal),
        cost: fullCost[goalStr],
      };
    }

    const neighbours = getNeighbourPoints(
      { x: map.length, y: map[map.length - 1].length },
      currentNode.pos
    );
    neighbours.forEach((pos) => {
      const posStr = point2dToString(pos);
      const bestPreviousCost =
        pathCost[posStr] === undefined ? Infinity : pathCost[posStr];
      const newCost = pathCost[currentNode.posStr] + map[pos.x][pos.y];

      if (newCost < bestPreviousCost) {
        cameFrom[posStr] = currentNode.pos;
        pathCost[posStr] = newCost;
        fullCost[posStr] = newCost + cheapestPossiblePath(pos, goal);

        if (!openNodes.find((node) => node.posStr === posStr)) {
          const addNode: OpenNode = {
            pos,
            posStr,
            cost: fullCost[posStr],
          };

          if (
            !openNodes.length ||
            openNodes[openNodes.length - 1].cost <= addNode.cost
          ) {
            openNodes.push(addNode);
            return;
          }

          let numLower = 0;
          while (openNodes[numLower].cost <= addNode.cost) {
            numLower += 1;
          }
          const after = openNodes.splice(numLower);
          openNodes.push(addNode);
          openNodes.push(...after);
        }
      }
    });
  }

  return {
    path: [],
    cost: -1,
  };
};

const printPath = (path: Path, map: number[][]) => {
  const pathMap = path.path.reduce<Record<string, boolean>>((prev, current) => {
    prev[point2dToString(current)] = true;
    return prev;
  }, {});
  console.log(
    map.reduce<string>(
      (prevRow, row, x) =>
        `${prevRow}${prevRow ? "\n" : ""}${row.reduce<string>(
          (prev, cost, y) =>
            `${prev}${pathMap[point2dToString({ x, y })] ? cost : " "}`,
          ""
        )}`,
      ""
    )
  );
};

describe("day 15", () => {
  let map: number[][];
  const start: Point2d = { x: 0, y: 0 };
  let goal: Point2d;

  beforeAll(() => {
    map = data.split("\n").map((row) => [...row].map((num) => +num));
    goal = { x: map.length - 1, y: map[map.length - 1].length - 1 };
  });

  it("1", () => {
    const path = aStar(start, goal, map);
    console.log("answer:", path.cost);
  });

  it.only("2", () => {
    const mapEnlarger = [0, 1, 2, 3, 4];
    const largeMap: number[][] = [];
    mapEnlarger.forEach((i) => {
      map.forEach((_, oldRowId) => {
        const row: number[] = [];
        mapEnlarger.forEach((j) => {
          map[oldRowId].forEach((oldCost) => {
            const newCost = oldCost + i + j;
            row.push(newCost > 9 ? newCost - 9 : newCost);
          });
        });
        largeMap.push(row);
      });
    });
    const largeGoal: Point2d = {
      x: largeMap.length - 1,
      y: largeMap[largeMap.length - 1].length - 1,
    };
    const path = aStar(start, largeGoal, largeMap);
    console.log("answer:", path.cost);
  });
});
