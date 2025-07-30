import { useState } from "react";
import { getWalletClient, publicClient } from "@/utils/viemClient";
import type { Address } from "viem";
import { SwitchAbi } from "@/utils/abis/switchAbi";
import { SWITCH_ADDRESS } from "@/utils/consts";
import { arbitrumSepolia } from "viem/chains";
import { encodeFunctionData } from "viem";

export type TxnStatus = "idle" | "pending" | "success" | "error";

interface UseSwitchReturn {
  /** call this to trigger turnOnLightBulb */
  turnOnLightBulb: (account: Address) => Promise<string>;
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
export function useSwitch(): UseSwitchReturn {
  const [status, setStatus] = useState<TxnStatus>("idle");
  const [txHash, setTxHash] = useState<string>();
  const [error, setError] = useState<string>();

  const turnOnLightBulb = async (account: Address): Promise<string> => {
    const client = getWalletClient();
    if (!client) throw new Error("Wallet not connected");

    try {
      setStatus("pending");
      setError(undefined);
      // send transaction
      const data = encodeFunctionData({
        abi: SwitchAbi,
        functionName: "turnOnLightBulb",
        args: [],
      });

      // Estimate gas via public client
      const estimatedGas = await publicClient.estimateGas({
        account,
        to: SWITCH_ADDRESS,
        data,
        value: BigInt(0),
      });
      const hash = await client.writeContract({
        address: SWITCH_ADDRESS,
        abi: SwitchAbi,
        functionName: "turnOnLightBulb",
        args: [],
        value: BigInt(0),
        chain: arbitrumSepolia,
        account,
        gas: estimatedGas,
      });
      setTxHash(hash);
      setStatus("success");
      return hash;
    } catch (e: any) {
      setError(e?.message ?? String(e));
      setStatus("error");
      throw e;
    }
  };

  return { turnOnLightBulb, txHash, error, status };
}
