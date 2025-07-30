// src/components/LightbulbControls.tsx
import React, { useEffect, useState } from "react";
import { Address } from "viem";
import { useSwitch } from "@/hooks/useSwitch";

export function LightbulbControls({
  account,
  isOn,
}: {
  account: Address | null;
  isOn: boolean;
}) {
  const { turnOnLightBulb, txHash, status } = useSwitch();
  const [tx, setTx] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!account) {
      alert("Please connect your wallet first");
      return;
    }
    await turnOnLightBulb(account);
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
      setTx(txHash);
    }
  }, [txHash]);

  return (
    <div className="e p-6 rounded-lg shadow-md">
      {/* Action Button */}
      {tx ? (
        <>
          <a
            href={`https://sepolia.arbiscan.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full px-4 py-2 border-2 border-white text-white rounded-lg hover:bg-yellow-700 transition"
          >
            View Transaction
          </a>
        </>
      ) : (
        <button
          onClick={handleSubmit}
          className="w-full px-4 py-2 border-2 border-white text-white rounded-lg hover:bg-yellow-700 transition"
          disabled={isLoading || isOn}
        >
          {isOn
            ? "Lightbulb is On"
            : isLoading
            ? "Turning On Lightbulb..."
            : "Turn On Lightbulb"}
        </button>
      )}
    </div>
  );
}
