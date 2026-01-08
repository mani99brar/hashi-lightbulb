import { useEffect, useState, useCallback } from "react";
import type { Address } from "viem";
import { encodeFunctionData } from "viem";
import { useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
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
export function useSwitch(
  switchChainId: number,
  lightbulbChainId: number
): UseSwitchReturn {
  const [status, setStatus] = useState<TxnStatus>("idle");
  const [txHash, setTxHash] = useState<string>();
  const [error, setError] = useState<string>();
  const {
    data: hash,
    sendTransaction,
    error: sendError,
  } = useSendTransaction();
  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: receiptError,
  } = useWaitForTransactionReceipt({
    hash,
    chainId: switchChainId,
  });
  const SWITCH_ADDRESS = SWITCH_ADDRESS_PER_CHAIN[lightbulbChainId];

  useEffect(() => {
    if (isConfirming) {
      setStatus("pending");
    }
    if (hash && isConfirmed) {
      setStatus("success");
      setTxHash(hash);
    }
    if (sendError || receiptError) {
      setError((sendError || receiptError)?.message || "Tx failed");
      setStatus("error");
    }
  }, [hash, isConfirming, isConfirmed, sendError, receiptError]);

  const getFees = useCallback(async () => {
    const publicClient = getPublicClient(switchChainId);
    const block = await publicClient.getBlock();
    const baseFeePerGas = block.baseFeePerGas ?? BigInt(0);
    // maxFeePerGas = baseFee * 1.2 + 2 gwei
    const maxPriorityFeePerGas = BigInt(2_000_000_000); // 2 gwei
    const maxFeePerGas = baseFeePerGas * BigInt(100) + maxPriorityFeePerGas;
    return {
      maxFeePerGas,
      maxPriorityFeePerGas,
    };
  }, []);

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
        chainId: switchChainId,
      });
    } catch (e) {
      setError(String(e));
      setStatus("error");
      throw e;
    }
  };

  return { turnOnLightBulb, txHash, error, status };
}
