// src/components/LightbulbControls.tsx
import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { type Address } from "viem";
import { useAppKitAccount } from "@reown/appkit/react";
import { Bridges, HashiAddress, Route } from "@/utils/consts";
import { useSwitch } from "@/hooks/useSwitch";
import { HistoryEntry } from "./HistoryDialog";
import { ensureChain, CHAIN_BY_ID } from "@/utils/viem";

export function LightbulbControls({
  setHistory,
  route,
}: {
  setHistory: React.Dispatch<React.SetStateAction<HistoryEntry[]>>;
  route: Route;
}) {
  const [threshold, setThreshold] = useState<number | "">("");
  const { turnOnLightBulb, txHash, status } = useSwitch(route);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmedTx, setConfirmedTx] = useState<string | null>(null);
  const availableBridges = Object.keys(route.bridges) as Bridges[];
  const [selectedBridges, setSelectedBridges] = useState<
    Partial<Record<Bridges, boolean>>
  >({});
  const { address: account } = useAppKitAccount();

  // reset bridge selection when the route changes
  useEffect(() => {
    setSelectedBridges({});
  }, [route]);

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

  const toggleBridge = (bridge: Bridges) => {
    setSelectedBridges((prev) => ({
      ...prev,
      [bridge]: !prev[bridge],
    }));
  };

  const chosenBridges = useMemo(
    () => availableBridges.filter((bridge) => selectedBridges[bridge]),
    // availableBridges is derived from route, which covers it as a dep
    [route, selectedBridges] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleSubmit = async () => {
    if (!account) {
      alert("Please connect your wallet first");
      return;
    }
    if (threshold === "" || isNaN(Number(threshold)) || Number(threshold) < 0) {
      alert("Please enter a valid non-negative threshold value");
      return;
    }
    const selectedHashiAddresses: HashiAddress[] = chosenBridges.map(
      (bridge) => route.bridges[bridge]!
    );
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
    (txHashValue: string) => {
      return {
        source: route.source,
        destination: route.destination,
        switchTx: txHashValue,
        threshold: Number(threshold),
        bridgeNames: chosenBridges,
      } as HistoryEntry;
    },
    [route, threshold, chosenBridges]
  );

  // last tx hash already handled, so re-renders can't append duplicates
  const processedTxRef = useRef<string | null>(null);

  useEffect(() => {
    if (!txHash || processedTxRef.current === txHash) return;
    processedTxRef.current = txHash;

    (async () => {
      try {
        const { publicClient: sourcePublicClient } = await ensureChain(
          route.source
        );
        await sourcePublicClient.waitForTransactionReceipt({
          hash: txHash as `0x${string}`,
          pollingInterval: 1_000,
        });

        setConfirmedTx(txHash);

        const bridgeEntry = createHistoryEntry(txHash);

        setHistory((prev) => {
          if (prev.some((entry) => entry.switchTx === bridgeEntry.switchTx)) {
            return prev;
          }
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
  }, [txHash, createHistoryEntry, setHistory, route]);

  const explorerUrl = CHAIN_BY_ID[route.source]?.blockExplorers?.default.url;

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
          {availableBridges.map((bridge) => (
            <label key={bridge} className="flex items-center">
              <input
                type="checkbox"
                checked={!!selectedBridges[bridge]}
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

      {/* Success Popup */}
      {confirmedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-black border-2 border-white rounded-lg p-6 max-w-md w-full mx-4 text-center">
            <h3 className="text-2xl font-semibold text-green-500 mb-3">
              Transaction Successful!
            </h3>
            <p className="mb-2">
              Your message was dispatched. The lightbulb will turn on once the
              selected bridges relay it.
            </p>
            <p className="mb-4 break-all text-sm">
              {explorerUrl ? (
                <a
                  href={`${explorerUrl}/tx/${confirmedTx}`}
                  target="_blank"
                  className="text-blue-500 hover:underline"
                >
                  {confirmedTx}
                </a>
              ) : (
                confirmedTx
              )}
            </p>
            <button
              onClick={() => setConfirmedTx(null)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
