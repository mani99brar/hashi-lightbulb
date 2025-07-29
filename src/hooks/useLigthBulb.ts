// hooks/useLightBulb.ts
import { useState, useEffect, useCallback } from "react";
import { chiadoPublicClient } from "@/utils/viemClient";
import type { Address } from "viem";
import { LightbulbAbi } from "@/utils/abis/lightbulbAbi";
import { LIGHTBULB_ADDRESS } from "@/utils/consts";

interface UseLightBulbReturn {
  /** `true` if on, `false` if off, `undefined` if not yet loaded or no address passed */
  isOn?: boolean | null;
  /** request in flight */
  loading: boolean;
  /** error message, if call failed */
  error?: string;
  /** re-run the on-chain query */
  refetch: () => Promise<void>;
}

/**
 * Hook to read `lightBulbIsOn(address)` from the Lightbulb contract.
 *
 * @param owner the address whose bulb state you want to read
 */
export function useLightBulb(owner?: Address): UseLightBulbReturn {
  const [isOn, setIsOn] = useState<boolean|null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

    const fetchState = useCallback(async () => {
      console.log("Fetching lightbulb state for:", owner);
        if (!owner) {
        console.warn("No owner address provided, cannot fetch state");
      setIsOn(null);
      return;
    }
    setLoading(true);
    setError(undefined);
    try {
      const result = await chiadoPublicClient.readContract({
        address: LIGHTBULB_ADDRESS,
        abi: LightbulbAbi,
        functionName: "lightBulbIsOn",
        args: [owner],
      });
        console.log("Lightbulb state:", result);
      setIsOn(result as boolean);
    } catch (e: any) {
        console.error("Failed to fetch lightbulb state", e);
      setError(e.message || String(e));
      setIsOn(null);
    } finally {
      setLoading(false);
    }
        console.log("FETCHED");
  }, [owner]);

  // auto‐fetch on owner change
  useEffect(() => {
    void fetchState();
  }, [fetchState]);

  return { isOn, loading, error, refetch: fetchState };
}
