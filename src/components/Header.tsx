"use client";

import React, { useEffect, useMemo, useCallback } from "react";
import { Address, type Chain } from "viem";
import { getWalletClient } from "@/utils/viemClient"; // your existing getter (dynamic)
import { arbitrumSepolia, gnosisChiado, sepolia } from "viem/chains";

// Centralize supported chains for the selector
const SUPPORTED_CHAINS: Chain[] = [arbitrumSepolia, gnosisChiado, sepolia];
const CHAIN_OPTIONS = SUPPORTED_CHAINS.map((c) => ({ id: c.id, name: c.name }));

export function Header({
  account,
  setAccount,
  walletChainId,
  setWalletChainId,
}: {
  account: Address | null;
  setAccount: (account: Address | null) => void;
  walletChainId: number;
  setWalletChainId: (chainId: number) => void;
}) {
  const walletClient = useMemo(() => getWalletClient(), []);

  const connectWallet = useCallback(async () => {
    const client = walletClient;
    if (!client) {
      alert("Please install MetaMask (or another Ethereum provider)");
      return;
    }
    try {
      const [addr] = await client.requestAddresses();
      setAccount(addr ?? null);
    } catch (err) {
      console.error("Wallet connection failed", err);
    }
  }, [walletClient, setAccount]);

  // Helper to switch or add+switch the chain when user changes selector
  const switchToChain = useCallback(
    async (targetChainId: number) => {
      const client = walletClient;
      if (!client || typeof window === "undefined" || !window.ethereum) return;
      try {
        await client.switchChain({ id: targetChainId });
      } catch (e) {
        // try add then switch
        const chain = SUPPORTED_CHAINS.find((c) => c.id === targetChainId);
        if (!chain) return;
        try {
          await (window as any).ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${chain.id.toString(16)}`,
                chainName: chain.name,
                nativeCurrency: chain.nativeCurrency,
                rpcUrls: chain.rpcUrls.default.http,
                blockExplorerUrls: chain.blockExplorers
                  ? [chain.blockExplorers.default.url]
                  : [],
              },
            ],
          });
          await client.switchChain({ id: targetChainId });
        } catch (err) {
          console.error("Failed to add/switch chain", err);
        }
      }
    },
    [walletClient]
  );

  // On mount: get any connected account; subscribe to account/chain changes
  useEffect(() => {
    const client = walletClient;
    if (!client) return;

    client.getAddresses().then((addrs) => {
      setAccount((addrs[0] as Address) ?? null);
    });

    const eth = typeof window !== "undefined" ? window.ethereum : null;
    if (!eth || !eth.on) return;

    const handleAccountsChanged = (accounts: string[]) => {
      setAccount((accounts[0] as Address) ?? null);
    };
    const handleChainChanged = (hexId: string) => {
      const id = Number(hexId);
      // Keep UI selector in sync if user switches in wallet
      if (id && id !== walletChainId) {
        setWalletChainId(id);
      }
    };

    eth.on("accountsChanged", handleAccountsChanged);
    eth.on("chainChanged", handleChainChanged);

    return () => {
      try {
        eth.removeListener("accountsChanged", handleAccountsChanged);
        eth.removeListener("chainChanged", handleChainChanged);
      } catch {}
    };
  }, [walletClient, setAccount, setWalletChainId, walletChainId]);

  const formatAddress = (addr: string) =>
    `${addr.slice(0, 6)}…${addr.slice(-4)}`;

  const onSelectChain = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextId = Number(e.target.value);
    setWalletChainId(nextId);
    // proactively try to switch wallet network to match selection
    await switchToChain(nextId);
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
      <h1 className="text-2xl font-bold">Hashi Lightbulb</h1>

      <div className="flex items-center gap-3">
        {/* Chain Selector */}
        <select
          value={walletChainId}
          onChange={onSelectChain}
          className="px-3 py-2 border border-gray-300 rounded-lg text-white text-sm"
          title="Select Lightbulb Chain"
        >
          {CHAIN_OPTIONS.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.name}
            </option>
          ))}
        </select>

        {/* Connect / Address */}
        <button
          onClick={connectWallet}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          {account ? formatAddress(account) : "Connect Wallet"}
        </button>
      </div>
    </header>
  );
}
