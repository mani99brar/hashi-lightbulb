// src/utils/viemClient.ts
import "viem/window"; // bring in the ambient types
import { createWalletClient, custom, createPublicClient, http } from "viem";
import { arbitrumSepolia, gnosisChiado } from "viem/chains";

let _walletClient: ReturnType<typeof createWalletClient> | null = null;

export function getWalletClient() {
  // already initialized?
  if (_walletClient) return _walletClient;

  // only run in browser and only if injected
  if (typeof window !== "undefined" && window.ethereum) {
    _walletClient = createWalletClient({
      chain: arbitrumSepolia,
        transport: custom(window.ethereum),
      
    });
    return _walletClient;
  }

  // no provider (MetaMask not installed or SSR)
  console.warn("No injected Ethereum provider found");
  return null;
}

export const publicClient = createPublicClient({
  chain: arbitrumSepolia,
  transport: http(),
});

export const chiadoPublicClient = createPublicClient({
  chain: gnosisChiado,
  transport: http(),
});