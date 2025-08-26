import { useState } from "react";
import type { Address } from "viem";
import { arbitrumSepolia } from "viem/chains";
import { encodeFunctionData } from "viem";
import { getWalletClient, ensureChain } from "@/utils/viemClient";
import { SwitchAbi } from "@/utils/abis/switchAbi";
import {
  HashiAddress,
  SWITCH_ADDRESS,
  LIGHTBULB_ADDRESS,
} from "@/utils/consts";

export type TxnStatus = "idle" | "pending" | "success" | "error";

interface UseSwitchReturn {
  /** call this to trigger turnOnLightBulb */
  turnOnLightBulb: (
    threshold: number,
    HashiAddresses: HashiAddress[],
    account: Address
  ) => Promise<string>;
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

  const turnOnLightBulb = async (
    threshold: number,
    bridges: HashiAddress[],
    account: Address
  ): Promise<string> => {
    const client = getWalletClient();
    if (!client) throw new Error("Wallet not connected");
    const reporters: Address[] = bridges.map((b) => b.reporter);
    const adapters: Address[] = bridges.map((b) => b.adapter);
    try {
      setStatus("pending");
      setError(undefined);
      // send transaction
      const data = encodeFunctionData({
        abi: SwitchAbi,
        functionName: "turnOnLightBulb",
        args: [LIGHTBULB_ADDRESS, threshold, reporters, adapters],
      });
      const { publicClient: arbSepoliaPublicClient } = await ensureChain(
        arbitrumSepolia.id
      );

      // Estimate gas via public client
      const estimatedGas = await arbSepoliaPublicClient.estimateGas({
        account,
        to: SWITCH_ADDRESS,
        data,
        value: BigInt(0),
      });
      console.log(
        "Txn args:",
        LIGHTBULB_ADDRESS,
        threshold,
        reporters,
        adapters
      );
      const hash = await client.writeContract({
        address: SWITCH_ADDRESS,
        abi: SwitchAbi,
        functionName: "turnOnLightBulb",
        args: [LIGHTBULB_ADDRESS, threshold, reporters, adapters],
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
