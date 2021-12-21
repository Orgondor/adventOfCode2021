type Subpackets = {
  lengthType: number;
  length: number;
  packets: Packet[];
};

type LiteralDecodeResult = {
  data: number;
  bitsRead: number;
};

type PacketDecodeResult = {
  packet: Packet;
  bitsRead: number;
};

type SubpacketsDecodeResult = {
  subpackets: Subpackets;
  bitsRead: number;
};

type PacketData = number | Subpackets;

export type Packet = {
  header: {
    version: number;
    type: number;
  };
  data: PacketData;
};

type PacketReader = (pos: number, bits: number) => number;

const createPacketReader =
  (buffer: Buffer): PacketReader =>
  (pos, bits) => {
    const bytePos = pos >> 3;
    const bitPos = pos & 0b111;
    const valueBuffer = new Uint32Array(1);
    valueBuffer[0] = buffer.slice(bytePos).readUInt32BE();
    const bitMask = new Uint32Array(1);
    const shiftDist = 32 - bits - bitPos;
    bitMask[0] = ((1 << bits) - 1) << shiftDist;
    return (valueBuffer[0] & bitMask[0]) >>> shiftDist;
  };

//    6   2   0   0   8   0   0   0   1   6   1   1   5   6   2   C   8   8   0   2   1   1   8   E   3   4
// 01100010000000001000000000000000000101100001000101010110001011001000100000000010000100011000111000110100
// VVVTTTILLLLLLLLLLLVVVTTTILLLLLLLLLLLLLLLVVVTTTDDDDDVVVTTTDDDDDVVVTTTILLLLLLLLLLLVVVTTTDDDDDVVVTTTDDDDD
//   3  01          2  0  00             22  0  4   10  5  4   11  1  01          2  0  4   12  3  4   13

export const decode = (packetHex: string): Packet => {
  // Add zeros to the end to make it possble to read 32 bit numbers all the way until the end of the message
  // Add an extra zero if needed in order to have full bytes
  const buffer = Buffer.from(
    packetHex.length & 1 ? `${packetHex}000000000` : `${packetHex}00000000`,
    "hex"
  );

  // let binary = "";
  // for (let i = 0; i * 2 < packetHex.length; i++) {
  //   const byte = buffer.readUInt8(i).toString(2);
  //   binary += "00000000".substr(byte.length) + byte;
  // }
  // console.log("binary", binary);

  const { packet } = decodePacket(buffer);
  return packet;
};

const decodePacket = (buffer: Buffer, bitsRead = 0): PacketDecodeResult => {
  const read = createPacketReader(buffer);

  const version = read(bitsRead, 3);
  bitsRead += 3;
  const type = read(bitsRead, 3);
  bitsRead += 3;

  let data: PacketData = 0;
  if (type === 4) {
    const result = decodeLiteral(buffer, bitsRead);
    data = result.data;
    bitsRead = result.bitsRead;
  } else {
    const result = decodeSubpackets(buffer, bitsRead);
    data = result.subpackets;
    bitsRead = result.bitsRead;
  }

  return {
    packet: {
      header: {
        version,
        type,
      },
      data,
    },
    bitsRead,
  };
};

const decodeLiteral = (
  buffer: Buffer,
  bitsRead: number
): LiteralDecodeResult => {
  const read = createPacketReader(buffer);
  const groupsValues: number[] = [];
  let moreData = 1;
  while (moreData) {
    moreData = read(bitsRead, 1);
    bitsRead += 1;
    groupsValues.push(read(bitsRead, 4));
    bitsRead += 4;
  }

  let value = 0;
  groupsValues.forEach((binary, i) => {
    // javascript does not play nice with shifting further than 30 (converts to signed int32)
    // slow workaround:
    value = value + binary * Math.pow(2, 4 * (groupsValues.length - i - 1));
  });

  return {
    data: value,
    bitsRead,
  };
};

const decodeSubpackets = (
  buffer: Buffer,
  bitsRead: number
): SubpacketsDecodeResult => {
  const read = createPacketReader(buffer);
  let length = 0;
  const lengthType = read(bitsRead, 1);
  bitsRead += 1;
  const packets: Packet[] = [];

  if (lengthType === 0) {
    length = read(bitsRead, 15);
    bitsRead += 15;
    const startOfSubpackets = bitsRead;

    while (bitsRead - startOfSubpackets < length) {
      const result = decodePacket(buffer, bitsRead);
      bitsRead = result.bitsRead;
      packets.push(result.packet);
    }
  } else {
    length = read(bitsRead, 11);
    bitsRead += 11;
    let packetsRead = 0;

    while (packetsRead < length) {
      const result = decodePacket(buffer, bitsRead);
      bitsRead = result.bitsRead;
      packets.push(result.packet);
      packetsRead += 1;
    }
  }

  return {
    subpackets: {
      lengthType,
      length,
      packets,
    },
    bitsRead,
  };
};

export const calculate = (packet: Packet): number => {
  if (typeof packet.data === "number") {
    if (packet.header.type !== 4) {
      throw new Error(`invalid operator packet`);
    }
    return packet.data;
  }

  let result = 0;

  switch (packet.header.type) {
    case 0:
      // sum
      packet.data.packets.forEach((subpacket) => {
        result += calculate(subpacket);
      });
      break;

    case 1:
      // product
      result = 1;
      packet.data.packets.forEach((subpacket) => {
        result *= calculate(subpacket);
      });
      break;

    case 2:
      // minimum
      result = Infinity;
      packet.data.packets.forEach((subpacket) => {
        result = Math.min(result, calculate(subpacket));
      });
      break;

    case 3:
      // maximum
      packet.data.packets.forEach((subpacket) => {
        result = Math.max(result, calculate(subpacket));
      });
      break;

    case 5:
      // greater than
      if (packet.data.packets.length !== 2) {
        throw new Error("Invalid greater than packet");
      }
      result =
        calculate(packet.data.packets[0]) > calculate(packet.data.packets[1])
          ? 1
          : 0;
      break;

    case 6:
      // less than
      if (packet.data.packets.length !== 2) {
        throw new Error("Invalid less than packet");
      }
      result =
        calculate(packet.data.packets[0]) < calculate(packet.data.packets[1])
          ? 1
          : 0;
      break;

    case 7:
      // equal
      if (packet.data.packets.length !== 2) {
        throw new Error("Invalid equal packet");
      }
      result =
        calculate(packet.data.packets[0]) === calculate(packet.data.packets[1])
          ? 1
          : 0;
      break;

    default:
      throw new Error(`Unknown packet type: ${packet.header.type}`);
  }

  return result;
};
