import React, { useState, useEffect } from "react";
import { getWalletClient } from "@/utils/viemClient";
import { fetchLightBulbToggledEvents } from "@/utils/logs";

/**
 * Always-visible dialog to check and display lightbulb on/off status.
 */
export function LightbulbStatusDialog() {
  // connected wallet address
  const [address, setAddress] = useState<string>("");
  // optional override input
  const [inputAddress, setInputAddress] = useState<string>("");
  // current lightbulb status
  const [isOn, setIsOn] = useState<boolean| null>(null);

  // fetch connected address on mount
    useEffect(() => {
        (async () => {
          const events = await fetchLightBulbToggledEvents();
          console.log("Fetched events:", events);
        })();
    const client = getWalletClient();
    if (client) {
      client.getAddresses().then((addrs) => {
        if (addrs?.length) setAddress(addrs[0]);
      });
    }
  }, []);

  /**
   * Trigger a status check for the given address (or connected address if none)
   */
  const handleCheckStatus = async () => {
    const addrToCheck = inputAddress.trim() || address;
    if (!addrToCheck) {
      alert("Please connect your wallet or enter an address");
      return;
    }
    try {
      // TODO: replace with real on-chain read (e.g. readContract)
      // For demo, randomly toggle status
      const simulated = Math.random() >= 0.5;
      setIsOn(simulated);
    } catch (err) {
      console.error("Failed to fetch status", err);
      alert("Error checking lightbulb status");
    }
  };

  return (
    <div className="bg-black border-2 border-white rounded-lg shadow-lg w-1/2 p-6 mx-auto flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-semibold mb-4">Lightbulb Status</h2>

        {/* Address Input */}
        <div className="mb-4">
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Address
          </label>
          <input
            id="address"
            type="text"
            value={inputAddress}
            onChange={(e) => setInputAddress(e.target.value)}
            placeholder={address || "Connect wallet to auto-fill"}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          />
        </div>

        {/* Check Status Button */}
        <div className="mb-4">
          <button
            onClick={handleCheckStatus}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Check Status
          </button>
        </div>
      </div>
      {/* Status Display */}
      <p
        className={`text-4xl font-large ${
          isOn === null
            ? "text-gray-400"
            : isOn
            ? "text-green-600"
            : "text-red-600"
        }`}
      >
        {isOn === null
          ? "No Status"
          : isOn
          ? "The lightbulb is ON"
          : "The lightbulb is OFF"}
      </p>
    </div>
  );
}
