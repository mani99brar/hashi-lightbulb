import type { Address } from "viem";

// Core enum/typing
export type HashiAddress = {
  adapter: Address;
  reporter: Address;
};

export enum Bridges {
  LZ = "LayerZero",
  CCIP = "CCIP",
  VEA = "Vea",
}

// Chain IDs for routing
export const CHAIN_IDS = {
  SEPOLIA: 11155111,
  CHIADO: 10200,
  ARB_SEPOLIA: 421614, // if needed in app logic
} as const;

// Source chain (Arbitrum Sepolia) contracts
export const YAHO_ADDRESS_ARBITRUM_SEPOLIA =
  "0xDbdF80c87f414fac8342e04D870764197bD3bAC7" as Address;

// Reporters live on Arbitrum Sepolia to Sepolia
export const REPORTERS_TO_SEPOLIA: Record<Bridges, Address> = {
  [Bridges.CCIP]: "0x8777F17F5ACE97f6d1E6Df41c94F84075fAEBf1B" as Address,
  [Bridges.LZ]: "0x25af7138f50CEf2573bb67A0227aB44045B7CC88" as Address, // 0x5abba3cb7f5b112c8704f21d497ff9e87779dc8c
  [Bridges.VEA]: "0xE803DA11AfC72CEa6Fa1A0AfC344015Cce5410A9" as Address, // 0xaea8caB21cF6B8f9a43797624553454944386170 DEVNET
};

// Reporters live on Arbitrum Sepolia to Chiado
export const REPORTERS_TO_CHIADO: Record<Bridges, Address> = {
  [Bridges.CCIP]: "0xACe8c605BBf459f6BDEd6FEc31e5B5E2CcC39F36" as Address,
  [Bridges.LZ]: "0x288dA9f5b01D9118AD0A1Fb998C1295fF1cf5c80" as Address,
  [Bridges.VEA]: "0x08fB59da08F58BAb8f10902C75250B2595492F62" as Address,
};

// Destination adapters per chain
export const ADAPTERS_SEPOLIA: Record<Bridges, Address> = {
  [Bridges.CCIP]: "0xc3613d84d156110Bc12aA4184C7EeFB1F8BD9cD2" as Address,
  [Bridges.LZ]: "0x5d8FA84CB2c649b19A2F3C1EC2F3210c2AE4B2F3" as Address, // 0x6edce65403992e310a62460808c4b910d972f10f
  [Bridges.VEA]: "0x8C04D410B1F3B5907dDf4F017FAf7DF1D7f5F597" as Address, // 0x018448E5C0455f21A9EfAaE62d684ECD7Ba5aD04 --- DEVNET
};

export const ADAPTERS_CHIADO: Record<Bridges, Address> = {
  [Bridges.CCIP]: "0xC1d4c6842e7388b53d09Bcc10Bd4FfC122c0c6DA" as Address,
  [Bridges.LZ]: "0x746dfa0251A31e587E97bBe0c58ED67A343280Df" as Address,
  [Bridges.VEA]: "0x8D71d12e1684916C62DDfe80De4D13F4D8894E82" as Address,
};

// Per-chain Lightbulb + Yaru targets
export const LIGHTBULB_PER_CHAIN: Record<number, Address> = {
  [CHAIN_IDS.SEPOLIA]: "0x44d3d3d8cB731958Df78DAf531b16E23DfB27450" as Address,
  [CHAIN_IDS.CHIADO]: "0x5e6fcfCaa61e4Db57858b7611eD2eC9Fb8e450dd" as Address, // replace with Chiado Lightbulb
};

export const YARU_PER_CHAIN: Record<number, Address> = {
  [CHAIN_IDS.SEPOLIA]: "0x231e48AAEaAC6398978a1dBA4Cd38fcA208Ec391" as Address,
  [CHAIN_IDS.CHIADO]: "0x639c26C9F45C634dD14C599cBAa27363D4665C53" as Address, // replace with Chiado Yaru
};

// Optional other app contracts that are chain-agnostic in UI
export const SWITCH_ADDRESS =
  "0x69E0ADAa6571422D174fc3e43e357c09465D0E75" as Address;

// BridgeAddresses helper per destination chain
export const BRIDGES_PER_CHAIN: Record<
  number,
  Record<Bridges, HashiAddress>
> = {
  [CHAIN_IDS.SEPOLIA]: {
    [Bridges.CCIP]: {
      adapter: ADAPTERS_SEPOLIA[Bridges.CCIP],
      reporter: REPORTERS_TO_SEPOLIA[Bridges.CCIP],
    },
    [Bridges.LZ]: {
      adapter: ADAPTERS_SEPOLIA[Bridges.LZ],
      reporter: REPORTERS_TO_SEPOLIA[Bridges.LZ],
    },
    [Bridges.VEA]: {
      adapter: ADAPTERS_SEPOLIA[Bridges.VEA],
      reporter: REPORTERS_TO_SEPOLIA[Bridges.VEA],
    },
  },
  [CHAIN_IDS.CHIADO]: {
    [Bridges.CCIP]: {
      adapter: ADAPTERS_CHIADO[Bridges.CCIP],
      reporter: REPORTERS_TO_CHIADO[Bridges.CCIP],
    },
    [Bridges.LZ]: {
      adapter: ADAPTERS_CHIADO[Bridges.LZ],
      reporter: REPORTERS_TO_CHIADO[Bridges.LZ],
    },
    [Bridges.VEA]: {
      adapter: ADAPTERS_CHIADO[Bridges.VEA],
      reporter: REPORTERS_TO_CHIADO[Bridges.VEA],
    },
  },
};

// Convenience: Yaho source by chain (Arbitrum Sepolia)
export const YAHO_SOURCE_BY_CHAIN: Record<number, Address> = {
  [CHAIN_IDS.ARB_SEPOLIA]: YAHO_ADDRESS_ARBITRUM_SEPOLIA,
};
