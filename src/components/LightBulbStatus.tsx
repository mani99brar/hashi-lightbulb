import React, { useState } from "react";
import { useLightBulb } from "@/hooks/useLigthBulb";
import { Address } from "viem";
import {
  Route,
  SOURCE_CHAIN_IDS,
  destinationsForSource,
  getRoute,
} from "@/utils/consts";
import { CHAIN_BY_ID } from "@/utils/viem";

const chainName = (id: number) => CHAIN_BY_ID[id]?.name ?? `Chain ${id}`;

/**
 * Always-visible dialog to check and display lightbulb on/off status.
 */
export function LightbulbStatusDialog({
  address,
  route,
  setRoute,
}: {
  address: string | undefined;
  route: Route;
  setRoute: React.Dispatch<React.SetStateAction<Route>>;
}) {
  // optional override input
  const [inputAddress, setInputAddress] = useState<string>("");
  // current lightbulb status; the hook auto-fetches on route/address change
  const { isOn, loading, refetch } = useLightBulb(route, address as Address);

  /**
   * Trigger a status check for the given address (or connected address if none)
   */
  const handleCheckStatus = async () => {
    const addrToCheck = address;
    if (!addrToCheck) {
      alert("Please connect your wallet or enter an address");
      return;
    }
    try {
      refetch();
    } catch (err) {
      console.error("Failed to fetch status", err);
      alert("Error checking lightbulb status");
    }
  };

  const handleSourceChain = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextSource = Number(e.target.value);
    if (!Number.isFinite(nextSource)) return;
    const [firstDestination] = destinationsForSource(nextSource);
    const nextRoute = getRoute(nextSource, firstDestination);
    if (nextRoute) setRoute(nextRoute);
  };

  const handleDestinationChain = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextDestination = Number(e.target.value);
    if (!Number.isFinite(nextDestination)) return;
    const nextRoute = getRoute(route.source, nextDestination);
    if (nextRoute) setRoute(nextRoute);
  };

  return (
    <div className="bg-black border-2 border-white rounded-lg shadow-lg w-1/2 p-6 mx-auto flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Lightbulb Status</h2>

          {/* Route Selectors */}
          <div className="flex gap-4">
            <label className="block text-sm">
              Switch chain
              <select
                value={route.source}
                onChange={handleSourceChain}
                className="ml-2 px-2 py-1 border rounded"
              >
                {SOURCE_CHAIN_IDS.map((id) => (
                  <option key={id} value={id}>
                    {chainName(id)}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              Lightbulb chain
              <select
                value={route.destination}
                onChange={handleDestinationChain}
                className="ml-2 px-2 py-1 border rounded"
              >
                {destinationsForSource(route.source).map((id) => (
                  <option key={id} value={id}>
                    {chainName(id)}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
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
            {loading ? "Checking..." : "Check Status"}
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
