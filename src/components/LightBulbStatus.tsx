import React, { useState, useEffect } from "react";
import { getWalletClient } from "@/utils/viemClient";
import { useLightBulb } from "@/hooks/useLigthBulb";
import { Address } from "viem";
import Lightbulb from "./LightBulb";

/**
 * Always-visible dialog to check and display lightbulb on/off status.
 */
export function LightbulbStatusDialog({
  setIsOn,
}: {
  setIsOn: (isOn: boolean) => void;
}) {
  // connected wallet address
  const [address, setAddress] = useState<string>("");

  // current lightbulb status
  const { isOn, loading, error, refetch } = useLightBulb(address as Address);

  // fetch connected address on mount
  useEffect(() => {
    const client = getWalletClient();
    if (client) {
      client.getAddresses().then((addrs) => {
        if (addrs?.length) setAddress(addrs[0]);
      });
    }
  }, []);

  useEffect(() => {
    if (!address || isOn) return;
    refetch(); // initial fetch
    const handle = setInterval(() => {
      refetch();
    }, 10_000); // 30 000 ms = 10 s
    return () => clearInterval(handle);
  }, [address, refetch]);

  useEffect(() => {
    if (isOn !== null && isOn !== undefined) {
      setIsOn(isOn);
    }
  }, [isOn, setIsOn]);

  return (
    <div>
      {/* Status Display */}
      <Lightbulb isOn={isOn!} />
    </div>
  );
}
