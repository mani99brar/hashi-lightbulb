import { Address } from "viem";
export const SWITCH_ADDRESS =
  "0xa9556a6635c7E8c43a9EBfDEC92421B932861EeB" as Address;
export const LIGHTBULB_ADDRESS =
  "0x99A4Cf71D089a282Ac171D9bDFEB7D182Ff13f83" as Address;
export const YARU_ADDRESS =
  "0x639c26C9F45C634dD14C599cBAa27363D4665C53" as Address;
export const YAHO_ADDRESS =
  "0xDbdF80c87f414fac8342e04D870764197bD3bAC7" as Address;

export type HashiAddress = {
  adapter: Address;
  reporter: Address;
};

export enum Bridges {
  LZ = "LayerZero",
  WH = "CCIP",
  VEA = "Vea",
}

export const CCIP_ADDRESS: HashiAddress = {
  adapter: "0xC1d4c6842e7388b53d09Bcc10Bd4FfC122c0c6DA",
  reporter: "0xACe8c605BBf459f6BDEd6FEc31e5B5E2CcC39F36",
};

export const LAYER_ZERO_ADDRESS: HashiAddress = {
  adapter: "0xfA08cfe2530c01045D953f824b836f6757670cD0",
  reporter: "0x3E7b05c278d33Ce8f9058282CF628f135263d0b8",
};

export const VEA_ADDRESS: HashiAddress = {
  adapter: "0xFe2E2b153910b65ce8C2ad9a0E010b07FB62F070",
  reporter: "0x36fed3b8eaeB87ab8Bc7dB90FA394fD7a1279CfB",
};

export const BridgeAddresses: Record<string, HashiAddress> = {
  [Bridges.LZ]: LAYER_ZERO_ADDRESS,
  [Bridges.WH]: CCIP_ADDRESS,
  [Bridges.VEA]: VEA_ADDRESS,
};
