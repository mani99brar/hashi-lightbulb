export const SwitchAbi = [
  {
    type: "function",
    name: "turnOnLightBulb",
    inputs: [
      { name: "_lightBulbChainId", type: "uint32", internalType: "uint32" },
      { name: "_targetAddress", type: "address", internalType: "address" },
      { name: "_threshold", type: "uint256", internalType: "uint256" },
      {
        name: "_reporters",
        type: "address[]",
        internalType: "contract IReporter[]",
      },
      {
        name: "_adapters",
        type: "address[]",
        internalType: "contract IAdapter[]",
      },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "yaho",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "contract IYaho" }],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "LightBulbToggled",
    inputs: [
      {
        name: "messageId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "lightBulbOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
];