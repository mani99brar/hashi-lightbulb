export const LightbulbAbi = [
  {
    type: "constructor",
    inputs: [
      { name: "_owner", type: "address", internalType: "address" },
      { name: "_yaru", type: "address", internalType: "address" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "SOURCE_CHAIN_ID",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "flipSwitch",
    inputs: [{ name: "_switchOn", type: "bool", internalType: "bool" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "lightBulbIsOn",
    inputs: [{ name: "", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "lightBulbSwitch",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "offBulb",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "onMessage",
    inputs: [
      { name: "messageId", type: "uint256", internalType: "uint256" },
      { name: "chainId", type: "uint256", internalType: "uint256" },
      { name: "sender", type: "address", internalType: "address" },
      { name: "threshold", type: "uint256", internalType: "uint256" },
      { name: "adapters", type: "address[]", internalType: "address[]" },
      { name: "data", type: "bytes", internalType: "bytes" },
    ],
    outputs: [{ name: "", type: "bytes", internalType: "bytes" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setLightBulbSwitch",
    inputs: [
      { name: "_lightBulbSwitch", type: "address", internalType: "address" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "yaru",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "LightBulbTurnedOn",
    inputs: [
      {
        name: "lightBulbOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "messageId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
];