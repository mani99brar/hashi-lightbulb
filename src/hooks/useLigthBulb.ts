// hooks/useLightBulb.ts
import { useState, useEffect, useCallback, useRef } from "react";
import { getPublic } from "@/utils/viem";
import type { Address } from "viem";
import { LightbulbAbi } from "@/utils/abis/lightbulbAbi";
import type { Route } from "@/utils/consts";

interface UseLightBulbReturn {
  /** `true` if on, `false` if off, `null` if not yet loaded or no address passed */
  isOn?: boolean | null;
  /** request in flight */
  loading: boolean;
  /** error message, if call failed */
  error?: string;
  /** re-run the on-chain query */
  refetch: () => Promise<void>;
}

/**
 * Hook to read `lightBulbIsOn(address)` from the Lightbulb contract on the
 * route's destination chain.
 *
 * @param route the route whose destination Lightbulb is read
 * @param owner the address whose bulb state you want to read
 */
export function useLightBulb(
  route: Route,
  owner?: Address
): UseLightBulbReturn {
  const [isOn, setIsOn] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  // increments per fetch so an outdated response can't overwrite a newer one
  const requestIdRef = useRef(0);

  const fetchState = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    if (!owner) {
      console.warn("No owner address provided, cannot fetch state");
      setIsOn(null);
      return;
    }
    setIsOn(null);
    setLoading(true);
    setError(undefined);
    try {
      const publicClient = getPublic(route.destination);
      const result = await publicClient.readContract({
        address: route.lightbulb,
        abi: LightbulbAbi,
        functionName: "lightBulbIsOn",
        args: [owner],
      });
      if (requestId !== requestIdRef.current) return; // stale response
      setIsOn(result as boolean);
    } catch (e) {
      if (requestId !== requestIdRef.current) return;
      console.error("Failed to fetch lightbulb state", e);
      setError(String(e));
      setIsOn(null);
    } finally {
      if (requestId === requestIdRef.current) setLoading(false);
    }
  }, [owner, route]);

  // auto-fetch on owner/route change
  useEffect(() => {
    void fetchState();
  }, [fetchState]);

  return { isOn, loading, error, refetch: fetchState };
}
