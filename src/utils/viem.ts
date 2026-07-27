// src/utils/viemClient.ts
import { createPublicClient, http, type Chain } from "viem";
import {
  arbitrum,
  arbitrumSepolia,
  base,
  baseSepolia,
  gnosisChiado,
  mainnet,
  sepolia,
  story,
} from "viem/chains";

export const SUPPORTED_CHAINS: Chain[] = [
  mainnet,
  base,
  arbitrum,
  story,
  sepolia,
  arbitrumSepolia,
  baseSepolia,
  gnosisChiado,
];
export const DEFAULT_CHAIN = arbitrumSepolia;
export const CHAIN_BY_ID: Record<number, Chain> = Object.fromEntries(
  SUPPORTED_CHAINS.map((c) => [c.id, c])
) as Record<number, Chain>;

const _publicClients = new Map<number, ReturnType<typeof createPublicClient>>();

// Optional RPC overrides; falls back to the chain's default public RPC.
// NEXT_PUBLIC_* env vars are inlined at build time, so each must be
// referenced statically.
const RPC_URLS: Record<number, string | undefined> = {
  [mainnet.id]: process.env.NEXT_PUBLIC_ETHEREUM_RPC,
  [base.id]: process.env.NEXT_PUBLIC_BASE_RPC,
  [arbitrum.id]: process.env.NEXT_PUBLIC_ARBITRUM_RPC,
  [story.id]: process.env.NEXT_PUBLIC_STORY_RPC,
  [sepolia.id]: process.env.NEXT_PUBLIC_SEPOLIA_RPC,
  [arbitrumSepolia.id]: process.env.NEXT_PUBLIC_ARBITRUM_SEPOLIA_RPC,
  [baseSepolia.id]: process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC,
  [gnosisChiado.id]: process.env.NEXT_PUBLIC_CHIADO_RPC,
};

export function getPublicClient(chainId: number) {
  const existing = _publicClients.get(chainId);
  if (existing) return existing;
  const chain = CHAIN_BY_ID[chainId];
  if (!chain) throw new Error(`Unsupported chain id: ${chainId}`);
  const client = createPublicClient({
    chain,
    // empty-string env values must also fall back to the default RPC
    transport: http(RPC_URLS[chainId] || undefined),
  });

  _publicClients.set(chain.id, client);
  return client;
}

export const getPublic = getPublicClient;

export async function ensureChain(chainId: number) {
  const target = CHAIN_BY_ID[chainId];
  if (!target) throw new Error(`Unsupported chain id: ${chainId}`);
  return { publicClient: getPublicClient(target.id), chain: target };
}
