import React from "react";
import { Hex, Address } from "viem";
import { getWalletClient, chiadoPublicClient } from "@/utils/viemClient";
import {
  HashiAddress,
  LIGHTBULB_ADDRESS,
  SWITCH_ADDRESS,
  YARU_ADDRESS,
} from "@/utils/consts";
import { YaruAbi } from "@/utils/abis/yaruAbi";
import { gnosisChiado } from "viem/chains";
import { BridgeAddresses, Bridges } from "@/utils/consts";

export interface HistoryEntry {
  nonce: string;
  data: Hex;
  threshold: number;
  bridges: HashiAddress[];
  /** original switch transaction hash */
  switchTx: string;
  /** LayerZero destination transaction hash */
  layerZero: {
    txHash: string;
    isUsed: boolean;
  };
  /** CCIP relayer transaction hash */
  CCIP: {
    txHash: string;
    isUsed: boolean;
  };
  /** Vea relayer transaction hash */
  vea: {
    txHash: string;
    isUsed: boolean;
  };
  /** has this message already been executed? */
  executed: boolean;
}

interface HistoryTableProps {
  account: Address;
  history: HistoryEntry[];
}

export function HistoryTable({ account, history }: HistoryTableProps) {
  const onExecute = async (entry: HistoryEntry) => {
    const client = getWalletClient();
    if (!client) {
      alert("Connect your wallet to execute messages");
      return;
    }
    const reporters: Address[] = entry.bridges.map((b) => b.reporter);
    const adapters: Address[] = entry.bridges.map((b) => b.adapter);
    try {
      // Build the Message struct for executeMessages
      const message = {
        nonce: entry.nonce,
        data: entry.data,
        targetChainId: 10200,
        threshold: entry.threshold,
        sender: SWITCH_ADDRESS,
        receiver: LIGHTBULB_ADDRESS,
        reporters,
        adapters,
      };

      // Call executeMessages on Yaru contract
      const txHash = await client.writeContract({
        address: YARU_ADDRESS,
        abi: YaruAbi,
        functionName: "executeMessages",
        args: [[message]],
        chain: gnosisChiado,
        account,
      });

      const receipt = await chiadoPublicClient.waitForTransactionReceipt({
        hash: txHash,
      });
      console.log("Receipt received:", receipt);

      if (receipt.status === "success") {
        alert(`Message executed successfully! Tx: ${txHash}`);
      } else {
        throw new Error("Transaction failed on-chain");
      }
    } catch (err: any) {
      console.error("executeMessages failed", err);
      alert(`Execution failed: ${err.message || err}`);
    }
  };
  return (
    <div className="mx-auto bg-black border-2 border-white w-full rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="pb-2 border-b">Switch TXN</th>
              <th className="pb-2 border-b">LayerZero</th>
              <th className="pb-2 border-b">CCIP</th>
              <th className="pb-2 border-b">Vea</th>
              <th className="pb-2 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {history.map((entry) => (
              <tr key={entry.switchTx}>
                <td className="py-2">
                  <a
                    href={`https://sepolia.arbiscan.io/tx/${entry.switchTx}`}
                    target="_blank"
                    className="text-blue-600 hover:underline"
                  >
                    {entry.switchTx.slice(0, 6)}…{entry.switchTx.slice(-4)}
                  </a>
                </td>
                <td className="py-2">
                  {entry.layerZero.isUsed ? (
                    <a
                      href={`https://testnet.layerzeroscan.com/tx/${entry.switchTx}`}
                      target="_blank"
                      className="text-blue-600 hover:underline"
                    >
                      Status
                    </a>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="py-2">
                  {" "}
                  {entry.CCIP.isUsed ? (
                    <a
                      href={`https://ccip.chain.link/`}
                      target="_blank"
                      className="text-blue-600 hover:underline"
                    >
                      Status
                    </a>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="py-2">
                  {entry.vea.isUsed ? (
                    entry.vea.txHash.slice(0, 6) +
                    "…" +
                    entry.vea.txHash.slice(-4)
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="py-2">
                  {!entry.executed && (
                    <button
                      onClick={() => onExecute(entry)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                      Execute
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
