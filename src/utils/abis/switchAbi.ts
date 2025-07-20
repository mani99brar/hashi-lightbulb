export const SwitchAbi = [
  {
    inputs: [
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
        indexed: true,
        internalType: "uint256",
        name: "messageId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "lightBulbOwner",
        type: "address",
      },
    ],
    name: "LightBulbToggled",
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
    inputs: [
      {
        internalType: "uint256",
        name: "_threshold",
        type: "uint256",
      },
    ],
    name: "setThreshold",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_targetAddress",
        type: "address",
      },
      {
        internalType: "contract IReporter[]",
        name: "_reporters",
        type: "address[]",
      },
      {
        internalType: "contract IAdapter[]",
        name: "_adapters",
        type: "address[]",
      },
    ],
    name: "turnOnLightBulb",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "yaho",
    outputs: [
      {
        internalType: "contract IYaho",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];