import { data, testData } from "./inputData";
import {
  Point3d,
  Matrix,
  matrixMultiply,
  point3dSubtract,
  point3dMatrixMultiply,
  point3dAdd,
  point3dToString,
} from "../util";

type Transformation = {
  rotation: Matrix;
  translation: Point3d;
};

type ScannerData = {
  name: string;
  beaconList: Point3d[];
  beaconMap: Record<string, boolean>;
  overlapsWith?: ScannerData;
  transformation?: Transformation;
};

describe("day 19", () => {
  let scannerData: ScannerData[];
  let beaconMap: Record<string, boolean>;

  beforeAll(() => {
    scannerData = data.split("\n\n").map((data): ScannerData => {
      const tmpData: ScannerData = { name: "", beaconList: [], beaconMap: {} };
      data
        .split("\n")
        .filter((row) => {
          if (row[1] === "-") {
            tmpData.name = row;
            return false;
          }
          return true;
        })
        .forEach((row) => {
          tmpData.beaconMap[row] = true;
          const coords = row.split(",");
          tmpData.beaconList.push({
            x: +coords[0],
            y: +coords[1],
            z: +coords[2],
          });
        });
      return tmpData;
    });

    beaconMap = { ...scannerData[0].beaconMap };

    const addToMap = (point: Point3d, from: ScannerData) => {
      const tranformed = point3dAdd(
        from.transformation.translation,
        point3dMatrixMultiply(point, from.transformation.rotation)
      );

      if (from.overlapsWith.overlapsWith) {
        addToMap(tranformed, from.overlapsWith);
        return;
      }

      beaconMap[point3dToString(tranformed)] = true;
    };

    const identity = [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ];
    const roll90 = [
      [1, 0, 0],
      [0, 0, -1],
      [0, 1, 0],
    ];
    const yaw90 = [
      [0, 0, -1],
      [0, 1, 0],
      [1, 0, 0],
    ];
    const pitch90 = [
      [0, -1, 0],
      [1, 0, 0],
      [0, 0, 1],
    ];
    const rolls = [
      identity,
      roll90,
      matrixMultiply(roll90, roll90),
      matrixMultiply(matrixMultiply(roll90, roll90), roll90),
    ];

    const rotations: Matrix[] = [];
    [
      identity,
      yaw90,
      matrixMultiply(yaw90, yaw90),
      matrixMultiply(matrixMultiply(yaw90, yaw90), yaw90),
      pitch90,
      matrixMultiply(matrixMultiply(pitch90, pitch90), pitch90),
    ].forEach((startRotation) => {
      rolls.forEach((roll) => {
        rotations.push(matrixMultiply(startRotation, roll));
      });
    });

    let unmatched = scannerData.slice(1).filter((data) => !data.overlapsWith);
    let matchingAgainst = scannerData[0];
    const matchedAgainst: string[] = [];
    while (unmatched.length) {
      unmatched.forEach((testData) => {
        rotations.some((rotation) =>
          matchingAgainst.beaconList.some((beacon) =>
            testData.beaconList.some((testPoint, i) => {
              const translation = point3dSubtract(
                beacon,
                point3dMatrixMultiply(testPoint, rotation)
              );

              let matches = 1;
              const doesMatch = testData.beaconList.some((matchTest, j) => {
                if (
                  i !== j &&
                  matchingAgainst.beaconMap[
                    point3dToString(
                      point3dAdd(
                        translation,
                        point3dMatrixMultiply(matchTest, rotation)
                      )
                    )
                  ]
                ) {
                  matches++;
                  return matches >= 12;
                }
              });

              if (doesMatch) {
                testData.overlapsWith = matchingAgainst;
                testData.transformation = {
                  rotation,
                  translation,
                };

                testData.beaconList.forEach((point) => {
                  addToMap(point, testData);
                });
              }
              return doesMatch;
            })
          )
        );
      });

      unmatched = scannerData.slice(1).filter((data) => !data.overlapsWith);
      matchedAgainst.push(matchingAgainst.name);
      matchingAgainst = scannerData.filter(
        (data) => data.overlapsWith && !matchedAgainst.includes(data.name)
      )[0];
    }
  });

  it("1", () => {
    console.log("answer:", Object.keys(beaconMap).length);
  });
});
