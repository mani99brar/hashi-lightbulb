import { Address } from "viem";
export const SWITCH_ADDRESS = "0xeFaBa97FDc41D754837C8e7853D0B12d0a04F6b1" as Address;
export const LIGHTBULB_ADDRESS = "0x3Fa9D1872703F2d8bc7e1a20d5f9921DE1E3EfA8" as Address;
export const YARU_ADDRESS = "0x639c26C9F45C634dD14C599cBAa27363D4665C53" as Address;
export const YAHO_ADDRESS = "0xDbdF80c87f414fac8342e04D870764197bD3bAC7" as Address;

export type HashiAddress = {
    adapter: Address;
    reporter: Address;
}

export enum Bridges {
    LZ = "LayerZero",
    WH = "Wormhole",
    VEA = "Vea",
}


export const WORMHOLE_ADDRESS: HashiAddress = {
  adapter: "0x821fA29F49e46c022e96DC840058Fc4c94F8d8aF",
  reporter: "0x96BEFBae4867f7E8b0257d905E0E97f132b99DfC",
};

export const LAYER_ZERO_ADDRESS: HashiAddress = {
  adapter: "0x746dfa0251A31e587E97bBe0c58ED67A343280Df",
  reporter: "0x288dA9f5b01D9118AD0A1Fb998C1295fF1cf5c80",
};

export const VEA_ADDRESS: HashiAddress = {
  adapter: "0x3Fa9D1872703F2d8bc7e1a20d5f9921DE1E3EfA8",
  reporter: "0x3Fa9D1872703F2d8bc7e1a20d5f9921DE1E3EfA8",
};  

export const BridgeAddresses: Record<string, HashiAddress> = {
  [Bridges.LZ]: LAYER_ZERO_ADDRESS,
  [Bridges.WH]: WORMHOLE_ADDRESS,
  [Bridges.VEA]: VEA_ADDRESS,
};
