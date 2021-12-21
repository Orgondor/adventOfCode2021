import { Packet } from "./decoder";

export type TestData1 = {
  input: string;
  decoded: Packet;
};

export const testCases: TestData1[] = [
  {
    input: `D2FE28`,
    decoded: {
      header: {
        version: 6,
        type: 4,
      },
      data: 2021,
    },
  },
  {
    input: `38006F45291200`,
    decoded: {
      header: {
        version: 1,
        type: 6,
      },
      data: {
        lengthType: 0,
        length: 27,
        packets: [
          {
            header: {
              version: 6,
              type: 4,
            },
            data: 10,
          },
          {
            header: {
              version: 2,
              type: 4,
            },
            data: 20,
          },
        ],
      },
    },
  },
  {
    input: `EE00D40C823060`,
    decoded: {
      header: {
        version: 7,
        type: 3,
      },
      data: {
        lengthType: 1,
        length: 3,
        packets: [
          {
            header: {
              version: 2,
              type: 4,
            },
            data: 1,
          },
          {
            header: {
              version: 4,
              type: 4,
            },
            data: 2,
          },
          {
            header: {
              version: 1,
              type: 4,
            },
            data: 3,
          },
        ],
      },
    },
  },
];

export type TestData2 = {
  input: string;
  value: number;
};

export const testData: TestData2[] = [
  { input: `C200B40A82`, value: 3 },
  { input: `04005AC33890`, value: 54 },
  { input: `880086C3E88112`, value: 7 },
  { input: `CE00C43D881120`, value: 9 },
  { input: `D8005AC2A8F0`, value: 1 },
  { input: `F600BC2D8F`, value: 0 },
  { input: `9C005AC2F8F0`, value: 0 },
  { input: `9C0141080250320F1802104A08`, value: 1 },
];
export const data = `A052E04CFD9DC0249694F0A11EA2044E200E9266766AB004A525F86FFCDF4B25DFC401A20043A11C61838600FC678D51B8C0198910EA1200010B3EEA40246C974EF003331006619C26844200D414859049402D9CDA64BDEF3C4E623331FBCCA3E4DFBBFC79E4004DE96FC3B1EC6DE4298D5A1C8F98E45266745B382040191D0034539682F4E5A0B527FEB018029277C88E0039937D8ACCC6256092004165D36586CC013A008625A2D7394A5B1DE16C0E3004A8035200043220C5B838200EC4B8E315A6CEE6F3C3B9FFB8100994200CC59837108401989D056280803F1EA3C41130047003530004323DC3C860200EC4182F1CA7E452C01744A0A4FF6BBAE6A533BFCD1967A26E20124BE1920A4A6A613315511007A4A32BE9AE6B5CAD19E56BA1430053803341007E24C168A6200D46384318A6AAC8401907003EF2F7D70265EFAE04CCAB3801727C9EC94802AF92F493A8012D9EABB48BA3805D1B65756559231917B93A4B4B46009C91F600481254AF67A845BA56610400414E3090055525E849BE8010397439746400BC255EE5362136F72B4A4A7B721004A510A7370CCB37C2BA0010D3038600BE802937A429BD20C90CCC564EC40144E80213E2B3E2F3D9D6DB0803F2B005A731DC6C524A16B5F1C1D98EE006339009AB401AB0803108A12C2A00043A134228AB2DBDA00801EC061B080180057A88016404DA201206A00638014E0049801EC0309800AC20025B20080C600710058A60070003080006A4F566244012C4B204A83CB234C2244120080E6562446669025CD4802DA9A45F004658527FFEC720906008C996700397319DD7710596674004BE6A161283B09C802B0D00463AC9563C2B969F0E080182972E982F9718200D2E637DB16600341292D6D8A7F496800FD490BCDC68B33976A872E008C5F9DFD566490A14`;
