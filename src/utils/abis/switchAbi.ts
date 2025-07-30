export const SwitchAbi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_veaInbox",
        type: "address",
      },
      {
        internalType: "address",
        name: "_lightBulb",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint64",
        name: "messageId",
        type: "uint64",
      },
      {
        indexed: false,
        internalType: "address",
        name: "lightBulbOwner",
        type: "address",
      },
    ],
    name: "lightBulbToggled",
    type: "event",
  },
  {
    inputs: [],
    name: "lightBulb",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "turnOnLightBulb",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "veaInbox",
    outputs: [
      {
        internalType: "contract IVeaInbox",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];