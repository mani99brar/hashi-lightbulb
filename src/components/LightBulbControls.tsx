// src/components/LightbulbControls.tsx
import React, { useEffect, useState } from "react";
import { Address } from "viem";
import { HashiAddress, BridgeAddresses, YAHO_ADDRESS } from "@/utils/consts";
import { useSwitch } from "@/hooks/useSwitch";
import { HistoryEntry } from "./HistoryDialog";
import { publicClient } from "@/utils/viemClient";
import { YahoAbi } from "@/utils/abis/yahoAbi";
import { encodeAbiParameters } from "viem";

type Bridge = "LayerZero" | "Wormhole" | "Vea";

export function LightbulbControls({account, setHistory}: { account: Address | null, setHistory: React.Dispatch<React.SetStateAction<HistoryEntry[]>> }) {
  const [threshold, setThreshold] = useState<number | "">("");
  const { turnOnLightBulb, txHash, status } = useSwitch();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBridges, setSelectedBridges] = useState<
    Record<Bridge, boolean>
  >({
    LayerZero: false,
    Wormhole: false,
    Vea: false,
  });

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
    if(!account) {
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
      (bridge) => BridgeAddresses[bridge]
    );
    console.log({ threshold, selectedHashiAddresses, account });
    await turnOnLightBulb(
      selectedHashiAddresses,
      account
    );
  };

  useEffect(() => {
    if (status === "pending") {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [status]);

  useEffect(() => {
    if (txHash) {
      let currentNonce = BigInt(0);
      (async () => {
        // Fetch current nonce from Yaho
        currentNonce = await publicClient.readContract({
          address: YAHO_ADDRESS,
          abi: YahoAbi,
          functionName: "currentNonce",
          args: [],
        }) as bigint;
        console.log("Current nonce on Yaho:", currentNonce);
        const messageNonce = Number(currentNonce) - 1;
        console.log("Message nonce for new entry:", messageNonce);
        const bridgeEntry: HistoryEntry = {
          nonce: messageNonce.toString(),
          data: encodeAbiParameters([{ type: "address" }], [account!]),
          switchTx: txHash,
          layerZero: {
            txHash: "",
            isUsed: selectedBridges.LayerZero,
          },
          wormhole: {
            txHash: "",
            isUsed: selectedBridges.Wormhole,
          },
          vea: {
            txHash: "",
            isUsed: selectedBridges.Vea,
          },
          executed: false,
        };
        console.log("Transaction sent:", txHash);
        setHistory((prev) => {
          const updated = [...prev, bridgeEntry];
          try {
            localStorage.setItem("lightbulbHistory", JSON.stringify(updated));
          } catch (e) {
            console.error("Failed to save history to localStorage", e);
          }
          return updated;
        });
      })();
      
    }
  }, [txHash]);

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
          {(["LayerZero", "Wormhole", "Vea"] as Bridge[]).map((bridge) => (
            <label key={bridge} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedBridges[bridge]}
                onChange={() => toggleBridge(bridge)}
                className="h-5 w-5 text-blue-600 border-gray-300 rounded"
              />
              <span className={`ml-3 ${selectedBridges[bridge] ? "text-blue-600" : "text-gray-700"}`}>{bridge}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={handleSubmit}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        {isLoading?"Turning On Lightbulb...":"Turn On Lightbulb"}
      </button>
    </div>
  );
}
