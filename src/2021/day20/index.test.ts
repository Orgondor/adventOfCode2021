import { data, testData } from "./inputData";
import { Point2d } from "../util";

const offsets = [-1, 0, 1];

describe("day 20", () => {
  let enhancement: string;
  let image: string[];
  let outside = "0";

  const getPixelValue = (pos: Point2d): number => {
    let pixelString = "";

    offsets.forEach((offset1) => {
      offsets.forEach((offset2) => {
        const x = pos.x + offset1;
        if (x < 0 || x >= image.length) {
          pixelString += outside;
          return;
        }

        const y = pos.y + offset2;
        if (y < 0 || y >= image[x].length) {
          pixelString += outside;
          return;
        }

        pixelString += image[x][y];
      });
    });

    return parseInt(pixelString, 2);
  };

  const enhance = () => {
    const tmpImage: string[] = [];
    for (let row = -1; row <= image.length; row++) {
      let pixelRow = "";
      for (let col = -1; col <= image[0].length; col++) {
        const value = getPixelValue({ x: row, y: col });
        pixelRow += enhancement[value];
      }
      tmpImage.push(pixelRow);
    }
    outside = enhancement[parseInt(outside.repeat(9), 2)];
    image = tmpImage;
  };

  const print = () => {
    let imageString = "";
    image.forEach((row, i) => {
      if (i > 0) {
        imageString += "\n";
      }
      imageString += row.replace(/1/g, "#").replace(/0/g, ".");
    });
    console.log(imageString);
  };

  beforeAll(() => {
    const tmp = data.replace(/#/g, "1").replace(/\./g, "0").split("\n\n");

    enhancement = tmp[0];
    image = tmp[1].split("\n");
  });

  it("1", () => {
    for (let i = 0; i < 2; i++) {
      enhance();
    }

    let total = 0;
    image.forEach((row) => {
      for (let i = 0; i < row.length; i++) {
        if (row[i] === "1") {
          total++;
        }
      }
    });

    console.log("answer:", total);
  });

  it.only("2", () => {
    for (let i = 0; i < 50; i++) {
      enhance();
    }

    let total = 0;
    image.forEach((row) => {
      for (let i = 0; i < row.length; i++) {
        if (row[i] === "1") {
          total++;
        }
      }
    });

    console.log("answer:", total);
  });
});
