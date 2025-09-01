import React from "react";
import { Hex, Address } from "viem";
import { getWalletClient, ensureChain, CHAIN_BY_ID } from "@/utils/viemClient";
import {
  HashiAddress,
  LIGHTBULB_PER_CHAIN,
  SWITCH_ADDRESS,
  YARU_PER_CHAIN,
} from "@/utils/consts";
import { YaruAbi } from "@/utils/abis/yaruAbi";

export interface HistoryEntry {
  chainId: number;
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
  chainId: number;
  account: Address | null;
  history: HistoryEntry[];
}

export function HistoryTable({ chainId, account, history }: HistoryTableProps) {
  const [isDeleted, setIsDeleted] = React.useState(false);
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
        targetChainId: chainId,
        threshold: entry.threshold,
        sender: SWITCH_ADDRESS,
        receiver: LIGHTBULB_PER_CHAIN[chainId],
        reporters,
        adapters,
      };

      const { publicClient } = await ensureChain(chainId);
      const estimatedGas = await publicClient.estimateContractGas({
        address: YARU_PER_CHAIN[chainId],
        abi: YaruAbi,
        functionName: "executeMessages",
        args: [[message]],
      });

      // Call executeMessages on Yaru contract
      const txHash = await client.writeContract({
        address: YARU_PER_CHAIN[chainId],
        abi: YaruAbi,
        functionName: "executeMessages",
        args: [[message]],
        chain: CHAIN_BY_ID[chainId],
        account,
        gas: estimatedGas,
      });
      const receipt = await publicClient.waitForTransactionReceipt({
        hash: txHash,
      });

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

  const onDelete = () => {
    localStorage.setItem("lightbulbHistory", JSON.stringify([]));
    setIsDeleted(true);
  };

  if (isDeleted) {
    return;
  }
  return (
    <div className="mx-auto bg-black border-2 border-white w-full rounded-lg shadow-md p-6">
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
        <button
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          onClick={() => {
            onDelete();
          }}
        >
          Delete All
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="pb-2 border-b w-1/6">Switch TXN</th>
              <th className="pb-2 border-b w-1/6">LayerZero</th>
              <th className="pb-2 border-b w-1/6">CCIP</th>
              <th className="pb-2 border-b w-1/6">Vea</th>
              <th className="pb-2 border-b w-2/6">Action</th>
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
                      disabled={entry.chainId == chainId && !chainId}
                      onClick={() => onExecute(entry)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                      {entry.chainId == chainId
                        ? "Execute"
                        : "Switch wallet to " +
                          CHAIN_BY_ID[entry.chainId]?.name}
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
