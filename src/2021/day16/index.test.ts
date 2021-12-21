import { calculate, decode, Packet } from "./decoder";
import { data, testCases, testData, TestData1, TestData2 } from "./inputData";

describe("day 16", () => {
  it.each(testCases)("validation tests", (caseData: TestData1) => {
    expect.assertions(1);
    const decoded = decode(caseData.input);
    expect(decoded).toEqual(caseData.decoded);
  });

  it.each(testData)("validation tests", (caseData: TestData2) => {
    expect.assertions(1);
    const decoded = decode(caseData.input);
    expect(calculate(decoded)).toEqual(caseData.value);
  });

  it("1", () => {
    const decoded = decode(data);
    const sumVersions = (packet: Packet): number => {
      let sum = packet.header.version;

      if (typeof packet.data !== "number") {
        packet.data.packets.forEach((subpacket) => {
          sum += sumVersions(subpacket);
        });
      }

      return sum;
    };

    console.log("answer:", sumVersions(decoded));
  });

  it.only("2", () => {
    const decoded = decode(data);

    console.log("answer:", calculate(decoded));
  });
});
