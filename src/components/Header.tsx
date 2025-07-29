// src/components/Header.tsx
"use client"; // if you’re in a Next.js App Router—ensures this file only runs on the client

import React, { useEffect, useState } from "react";
import { getWalletClient } from "@/utils/viemClient";
import { Address } from "viem";

export function Header({account, setAccount}: {
  account: Address | null;
  setAccount: (account: Address | null) => void;
}) {
  const connectWallet = async () => {
    const client = getWalletClient();
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
  };

  useEffect(() => {
    const client = getWalletClient();
    if (!client) return;

    // load any already‐connected account
    client.getAddresses().then((addrs) => {
      setAccount(addrs[0] ?? null);
    });

    // subscribe to account changes if using MetaMask or compatible provider
    if (window.ethereum && window.ethereum.on) {
      const handleAccountsChanged = (accounts: string[]) => {
        setAccount(accounts[0] as Address?? null);
      };
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      return () => {
        window.ethereum!.removeListener("accountsChanged", handleAccountsChanged);
      };
    }
  }, []);

  const formatAddress = (addr: string) =>
    `${addr.slice(0, 6)}…${addr.slice(-4)}`;

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
      <h1 className="text-2xl font-bold">Hashi Lightbulb</h1>
      <button
        onClick={connectWallet}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        {account ? formatAddress(account) : "Connect Wallet"}
      </button>
    </header>
  );
}
