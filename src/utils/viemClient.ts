// src/utils/viemClient.ts
import "viem/window";
import {
  createWalletClient,
  custom,
  createPublicClient,
  http,
  publicActions,
  type Chain,
} from "viem";
import { arbitrumSepolia, gnosisChiado, sepolia } from "viem/chains";

export const SUPPORTED_CHAINS: Chain[] = [
  arbitrumSepolia,
  gnosisChiado,
  sepolia,
];

export const DEFAULT_CHAIN = arbitrumSepolia;
export const CHAIN_BY_ID = Object.fromEntries(
  SUPPORTED_CHAINS.map((c) => [c.id, c])
);

let _walletClient: ReturnType<typeof createWalletClient> | null = null;
const _publicClients = new Map<number, ReturnType<typeof createPublicClient>>();

export function getPublicClient(chainId: number) {
  const existing = _publicClients.get(chainId);
  if (existing) return existing;
  const chain = CHAIN_BY_ID[chainId] ?? DEFAULT_CHAIN;
  const client = createPublicClient({ chain, transport: http() });
  _publicClients.set(chain.id, client);
  return client;
}

export function getWalletClient() {
  if (_walletClient) return _walletClient;
  if (typeof window === "undefined" || !window.ethereum) {
    console.warn("No injected Ethereum provider found");
    return null;
  }

  _walletClient = createWalletClient({
    chain: DEFAULT_CHAIN,
    transport: custom(window.ethereum),
  }).extend(publicActions);
  return _walletClient;
}

export function getPublic(chainId: number) {
  const existing = _publicClients.get(chainId);
  if (existing) return existing;
  const chain = CHAIN_BY_ID[chainId] ?? DEFAULT_CHAIN;
  const client = createPublicClient({ chain, transport: http() });
  _publicClients.set(chain.id, client);
  return client;
}

export async function ensureChain(chainId: number) {
  const target = CHAIN_BY_ID[chainId];
  console.log(target);
  const wallet = getWalletClient();
  if (!wallet) throw new Error("Wallet not available");
  try {
    await wallet.switchChain({ id: target.id });
  } catch {
    await(window as any).ethereum?.request?.({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: `0x${target.id.toString(16)}`,
          chainName: target.name,
          nativeCurrency: target.nativeCurrency,
          rpcUrls: target.rpcUrls.default.http,
          blockExplorerUrls: target.blockExplorers
            ? [target.blockExplorers.default.url]
            : [],
        },
      ],
    });
    await wallet.switchChain({ id: target.id });
  }
  return { wallet, publicClient: getPublic(target.id) };
}
