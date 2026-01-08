import { useEffect, useState, useCallback } from "react";
import type { Address } from "viem";
import { encodeFunctionData } from "viem";
import { useSendTransaction } from "wagmi";
import { SwitchAbi } from "@/utils/abis/switchAbi";
import { SWITCH_ADDRESS_PER_CHAIN } from "@/utils/consts";
import { getPublicClient } from "@/utils/viem";
import { arbitrumSepolia } from "viem/chains";
export type TxnStatus = "idle" | "pending" | "success" | "error";

interface UseSwitchReturn {
  /** function to call to turn on the lightbulb */
  turnOnLightBulb: () => Promise<void>;
  /** current transaction hash (if any) */
  txHash?: string;
  /** error message (if any) */
  error?: string;
  /** status of the tx */
  status: TxnStatus;
}

/**
 * Hook to interact with the Switch contract's turnOnLightBulb function.
 *
 * @param contractAddress - deployed Switch contract address
 */
export function useSwitch(lightbulbChainId: number): UseSwitchReturn {
  const [status, setStatus] = useState<TxnStatus>("idle");
  const [txHash, setTxHash] = useState<string>();
  const [error, setError] = useState<string>();
  const { data: hash, sendTransaction } = useSendTransaction();
  const SWITCH_ADDRESS = SWITCH_ADDRESS_PER_CHAIN[lightbulbChainId];

  useEffect(() => {
    if (hash) {
      setTxHash(hash);
    }
  }, [hash]);

  const turnOnLightBulb = async (): Promise<void> => {
    try {
      setStatus("pending");
      setError(undefined);
      // send transaction
      const data = encodeFunctionData({
        abi: SwitchAbi,
        functionName: "turnOnLightBulb",
        args: [],
      });
      const { maxFeePerGas, maxPriorityFeePerGas } = await getFees();
      sendTransaction({
        to: SWITCH_ADDRESS,
        data,
        value: BigInt(0),
        maxFeePerGas,
        maxPriorityFeePerGas,
      });
      setStatus("success");
    } catch (e) {
      setError(String(e));
      setStatus("error");
      throw e;
    }
  };

  const getFees = useCallback(async () => {
    const publicClient = getPublicClient(arbitrumSepolia.id);
    const block = await publicClient.getBlock();
    const baseFeePerGas = block.baseFeePerGas ?? BigInt(0);
    // maxFeePerGas = baseFee * 1.2 + 2 gwei
    const maxPriorityFeePerGas = BigInt(2_000_000_000); // 2 gwei
    const maxFeePerGas =
      (baseFeePerGas * BigInt(12)) / BigInt(10) + maxPriorityFeePerGas;
    return {
      maxFeePerGas,
      maxPriorityFeePerGas,
    };
  }, []);

  return { turnOnLightBulb, txHash, error, status };
}
