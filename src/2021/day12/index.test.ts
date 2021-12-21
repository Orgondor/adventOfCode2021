import { data, testData1, testData2, testData3 } from "./inputData";

type Cave = {
  name: string;
  large: boolean;
};

type Connections = Record<string, string[]>;

type ExpandedRoute = {
  route: string[];
  smallDoubled: boolean;
};

const addCaveToMap = (caveMap: Record<string, Cave>, cave: string) => {
  if (!caveMap[cave]) {
    caveMap[cave] = {
      name: cave,
      large: cave.toUpperCase() === cave,
    };
  }
};

const addConnections = (connections: Connections, a: string, b: string) => {
  if (!connections[a]) {
    connections[a] = [b];
  } else if (!connections[a].includes(b)) {
    connections[a].push(b);
  }
  if (!connections[b]) {
    connections[b] = [a];
  } else if (!connections[b].includes(a)) {
    connections[b].push(a);
  }
};

const createRouteFinder = (
  caveMap: Record<string, Cave>,
  connections: Connections,
  finishedRoutes: string[][]
) =>
  function findRoute(route: string[]) {
    const currentCave = route[route.length - 1];
    if (currentCave === "end") {
      finishedRoutes.push(route);
      return;
    }

    connections[currentCave].forEach((nextCave) => {
      if (caveMap[nextCave].large || !route.includes(nextCave)) {
        findRoute([...route, nextCave]);
      }
    });
  };

const createExpandedRouteFinder = (
  caveMap: Record<string, Cave>,
  connections: Connections,
  finishedRoutes: ExpandedRoute[]
) =>
  function findRoute(route: ExpandedRoute) {
    const currentCave = route.route[route.route.length - 1];
    if (currentCave === "end") {
      finishedRoutes.push(route);
      return;
    }

    if (currentCave === "start" && route.route.length > 1) {
      return;
    }

    connections[currentCave].forEach((nextCave) => {
      if (
        caveMap[nextCave].large ||
        !route.smallDoubled ||
        !route.route.includes(nextCave)
      ) {
        findRoute({
          route: [...route.route, nextCave],
          smallDoubled:
            route.smallDoubled ||
            (!caveMap[nextCave].large && route.route.includes(nextCave)),
        });
      }
    });
  };

describe("day 12", () => {
  const caveMap: Record<string, Cave> = {};
  const connections: Connections = {};

  beforeAll(() => {
    data.split("\n").forEach((pathStr) => {
      const [a, b] = pathStr.split("-");
      addCaveToMap(caveMap, a);
      addCaveToMap(caveMap, b);
      addConnections(connections, a, b);
    });
  });

  it("1", () => {
    const routes: string[][] = [];
    const routeFinder = createRouteFinder(caveMap, connections, routes);
    routeFinder(["start"]);
    console.log("answer:", routes.length);
  });

  it.only("2", () => {
    const routes: ExpandedRoute[] = [];
    const routeFinder = createExpandedRouteFinder(caveMap, connections, routes);
    routeFinder({ route: ["start"], smallDoubled: false });
    console.log("answer:", routes.length);
  });
});
