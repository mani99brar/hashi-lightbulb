import React, { useEffect, useState } from "react";
import { useLightBulb } from "@/hooks/useLigthBulb";
import { Address, Chain } from "viem";
import { arbitrumSepolia, gnosisChiado, sepolia } from "viem/chains";
import { Lightbulb } from "./Lightbulb";
import { useSwitch } from "@/hooks/useSwitch";

const LIGHTBULB_CHAINS: Chain[] = [gnosisChiado, sepolia];

/**
 * Always-visible dialog to check and display lightbulb on/off status.
 */
export function LightbulbStatusDialog({
  address,
  lightbulbChainId,
  setLightbulbChainId,
  setHistory,
}: {
  address: string | undefined;
  lightbulbChainId: number;
  setLightbulbChainId: React.Dispatch<React.SetStateAction<number>>;
  setHistory: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const [buttonMsg, setButtonMsg] = useState<string>("");
  const { turnOnLightBulb, txHash, status } = useSwitch(
    arbitrumSepolia.id,
    lightbulbChainId
  );

  // current lightbulb status
  const { isOn, loading, refetch } = useLightBulb(
    lightbulbChainId,
    address as Address
  );

  // fetch connected address on mount
  useEffect(() => {
    refetch(lightbulbChainId);
  }, [lightbulbChainId, refetch]);

  const handleToggleLightbulb = async () => {
    if (!address) {
      alert("Please connect your wallet first");
      return;
    }
    await turnOnLightBulb();
  };

  const handleLightbulbChain = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextId = Number(e.target.value);
    if (Number.isFinite(nextId)) {
      setLightbulbChainId(nextId);
    }
  };

  useEffect(() => {
    console.log("Status changed:", status);
    console.log("TxHash:", txHash);
    console.log("Loading:", loading);
    if (loading) {
      setButtonMsg("Getting Lightbulb state.");
    }
    if (status === "success") {
      setButtonMsg("Message sent to Lightbulb!");
    } else if (status !== "idle") {
      setButtonMsg(`Turning On...`);
    } else {
      setButtonMsg("Turn On Lightbulb");
    }

    if (!txHash) return;
    setHistory((prev) => {
      const updated = [...prev, txHash];
      try {
        localStorage.setItem(
          `VeaLightbulbHistory-${lightbulbChainId}`,
          JSON.stringify(updated)
        );
      } catch (e) {
        console.error("Failed to save history to localStorage", e);
      }
      return updated;
    });
  }, [txHash, loading, status]);

  return (
    <div className="bg-[#009eb0] border-2 border-white rounded-lg shadow-lg w-3/4 mx-auto flex justify-between">
      <div className="w-3/5 flex flex-col justify-between p-6 gap-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Switch</h2>

          {/* Lightbulb Chain Selector */}
          <label className="block text-sm">
            Lightbulb chain
            <select
              value={lightbulbChainId}
              onChange={handleLightbulbChain}
              className="ml-2 px-2 py-1 border rounded"
            >
              {LIGHTBULB_CHAINS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <p>
          The lighbulb state is currently synchronized to{" "}
          {LIGHTBULB_CHAINS.find((c) => c.id === lightbulbChainId)?.name} <br />
          Toggle the switch on Arbitrum Sepolia to send a message with Vea and
          turn on the lightbulb on selected chain.
        </p>

        {/* Check Status Button */}
        <div className="mb-4">
          <button
            onClick={handleToggleLightbulb}
            className="w-full px-4 py-2 bg-[#0064b0] text-white rounded-lg hover:bg-[#005080] transition"
          >
            {buttonMsg}
          </button>
        </div>
      </div>
      <div className="w-2/5 flex flex-col gap-8 items-center bg-[#0064b0]">
        <p className="p-6 text-xl">Status : {isOn ? "ON" : "OFF"}</p>
        <div>
          <Lightbulb isOn={isOn} size="lg" />
        </div>
      </div>
    </div>
  );
}
