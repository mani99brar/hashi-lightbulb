// src/utils/viemClient.ts
import { createPublicClient, http, type Chain } from "viem";
import { arbitrumSepolia, gnosisChiado, sepolia } from "viem/chains";
import { createConfig } from "wagmi";
import { config as wagmiConfigFromApp } from "./wagmi";

export const SUPPORTED_CHAINS: Chain[] = [arbitrumSepolia, gnosisChiado, sepolia];
export const DEFAULT_CHAIN = arbitrumSepolia;
export const CHAIN_BY_ID: Record<number, Chain> = Object.fromEntries(
  SUPPORTED_CHAINS.map((c) => [c.id, c])
) as Record<number, Chain>;

const _publicClients = new Map<number, ReturnType<typeof createPublicClient>>();

export function getPublicClient(chainId: number) {
  const existing = _publicClients.get(chainId);
  if (existing) return existing;
  const chain = CHAIN_BY_ID[chainId] ?? DEFAULT_CHAIN;
  const client = createPublicClient({ chain, transport: http() });
  _publicClients.set(chain.id, client);
  return client;
}

export const getPublic = getPublicClient;

export async function ensureChain(chainId: number) {
  const target = CHAIN_BY_ID[chainId] ?? DEFAULT_CHAIN;
  const cfg = wagmiConfigFromApp as ReturnType<typeof createConfig>;
  return { publicClient: getPublicClient(target.id), chain: target };
} 
