// src/components/LightbulbControls.tsx
import React, { useEffect, useState, useCallback } from "react";
import { arbitrumSepolia } from "viem/chains";
import { type Address } from "viem";
import { useAppKitAccount } from "@reown/appkit/react";
import {
  HashiAddress,
  BRIDGES_PER_CHAIN,
  YAHO_ADDRESS_ARBITRUM_SEPOLIA,
} from "@/utils/consts";
import { useSwitch } from "@/hooks/useSwitch";
import { HistoryEntry } from "./HistoryDialog";
import { ensureChain } from "@/utils/viem";
import { YahoAbi } from "@/utils/abis/yahoAbi";
import { encodeAbiParameters, decodeEventLog } from "viem";
import type { MessageDispatchedLog } from "@/utils/types";

type Bridge = "LayerZero" | "CCIP" | "Vea";

export function LightbulbControls({
  setHistory,
  lightbulbChainId,
}: {
  setHistory: React.Dispatch<React.SetStateAction<HistoryEntry[]>>;
  lightbulbChainId: number;
}) {
  const [threshold, setThreshold] = useState<number | "">("");
  const { turnOnLightBulb, txHash, status } = useSwitch(lightbulbChainId);
  const [isLoading, setIsLoading] = useState(false);
  const [bridges, setBridges] = useState<HashiAddress[]>([]);
  const [selectedBridges, setSelectedBridges] = useState<
    Record<Bridge, boolean>
  >({
    LayerZero: false,
    CCIP: false,
    Vea: false,
  });
  const { address: account } = useAppKitAccount();
  const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "") {
      setThreshold("");
    } else {
      // ensure only non-negative integers
      const num = parseInt(val, 10);
      if (!isNaN(num) && num >= 0) setThreshold(num);
    }
  };

  const toggleBridge = (bridge: Bridge) => {
    setSelectedBridges((prev) => ({
      ...prev,
      [bridge]: !prev[bridge],
    }));
  };

  const handleSubmit = async () => {
    if (!account) {
      alert("Please connect your wallet first");
      return;
    }
    if (threshold === "" || isNaN(Number(threshold)) || Number(threshold) < 0) {
      alert("Please enter a valid non-negative threshold value");
      return;
    }
    const chosen = (Object.keys(selectedBridges) as Bridge[]).filter(
      (bridge) => selectedBridges[bridge]
    );
    const selectedHashiAddresses: HashiAddress[] = chosen.map(
      (bridge) => BRIDGES_PER_CHAIN[lightbulbChainId][bridge]
    );
    setBridges(selectedHashiAddresses);
    await turnOnLightBulb(
      threshold,
      selectedHashiAddresses,
      account as Address
    );
  };

  useEffect(() => {
    if (status === "pending") {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [status]);

  const createHistoryEntry = useCallback(
    (messageNonce: number, txHashValue: string) => {
      return {
        chainId: lightbulbChainId,
        nonce: messageNonce.toString(),
        data: encodeAbiParameters([{ type: "address" }], [account as Address]),
        switchTx: txHashValue,
        threshold: Number(threshold),
        bridges,
        layerZero: { txHash: "", isUsed: selectedBridges.LayerZero },
        CCIP: { txHash: "", isUsed: selectedBridges.CCIP },
        vea: { txHash: "", isUsed: selectedBridges.Vea },
        executed: false,
      } as HistoryEntry;
    },
    [lightbulbChainId, account, threshold, bridges, selectedBridges]
  );

  useEffect(() => {
    if (!txHash) return;

    (async () => {
      try {
        const { publicClient: arbSepoliaPublicClient } = await ensureChain(
          arbitrumSepolia.id
        );
        const receipt = await arbSepoliaPublicClient.waitForTransactionReceipt({
          hash: txHash as `0x${string}`,
          pollingInterval: 1_000,
        });

        const yahoLogs = receipt.logs.filter(
          (log) =>
            log.address.toLowerCase() ===
            YAHO_ADDRESS_ARBITRUM_SEPOLIA.toLowerCase()
        );

        let messageNonce = 0;
        if (yahoLogs[0]) {
          try {
            const decoded = decodeEventLog({
              abi: YahoAbi,
              data: yahoLogs[0].data,
              topics: yahoLogs[0].topics,
            }) as unknown as MessageDispatchedLog;
            if (decoded.eventName === "MessageDispatched") {
              messageNonce = Number(decoded.args.message.nonce);
            }
          } catch (err) {
            console.error("Failed to decode Yaho log:", err);
          }
        }

        const bridgeEntry = createHistoryEntry(messageNonce, txHash);

        setHistory((prev) => {
          const updated = [...prev, bridgeEntry];
          try {
            localStorage.setItem("lightbulbHistory", JSON.stringify(updated));
          } catch (e) {
            console.error("Failed to save history to localStorage", e);
          }
          return updated;
        });
      } catch (error) {
        console.error("Transaction confirmation failed:", error);
      }
    })();
  }, [txHash, createHistoryEntry, setHistory]);

  return (
    <div className="w-1/2 mr-10 mx-auto bg-black border-2 border-white p-6 rounded-lg shadow-md">
      {/* Threshold Input */}
      <div className="mb-6">
        <label htmlFor="threshold" className="block text-lg font-medium mb-2">
          Set Threshold Value
        </label>
        <input
          id="threshold"
          type="number"
          min="0"
          value={threshold}
          onChange={handleThresholdChange}
          placeholder="Enter threshold"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Bridge Checkboxes */}
      <div className="mb-6">
        <span className="block text-lg font-medium mb-2">Select Bridge</span>
        <div className="space-y-3 pl-2">
          {(["LayerZero", "CCIP", "Vea"] as Bridge[]).map((bridge) => (
            <label key={bridge} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedBridges[bridge]}
                onChange={() => toggleBridge(bridge)}
                className="h-5 w-5 text-blue-600 border-gray-300 rounded"
              />
              <span
                className={`ml-3 ${
                  selectedBridges[bridge] ? "text-blue-600" : "text-gray-700"
                }`}
              >
                {bridge}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={handleSubmit}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        {isLoading ? "Turning On Lightbulb..." : "Turn On Lightbulb"}
      </button>
    </div>
  );
}
