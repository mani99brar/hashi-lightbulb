import React from "react";
import { Address } from "viem";
import { ensureChain, CHAIN_BY_ID } from "@/utils/viem";
import {
  LIGHTBULB_PER_CHAIN,
  SWITCH_ADDRESS_PER_CHAIN,
  YARU_PER_CHAIN,
} from "@/utils/consts";
import { arbitrumSepolia } from "viem/chains";

interface HistoryTableProps {
  chainId: number;
  history: string[];
}

function formatTimestamp(ts: number) {
  // assuming UNIX seconds
  const d = new Date(ts * 1000); // multiply by 1000 for ms [web:27]
  return d.toLocaleString();
}

export function HistoryTable({ chainId, history }: HistoryTableProps) {
  return (
    <div className="w-3/4 border-2 border-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">History</h3>

      {history.length === 0 ? (
        <p className="text-gray-400 text-sm">No history yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-gray-700 text-gray-300">
              <tr>
                <th className="py-2 pr-4">
                  Transactions for {CHAIN_BY_ID[chainId]?.name} Lightbulb
                </th>
              </tr>
            </thead>
            <tbody>
              {history.map((entry, key) => (
                <tr
                  key={key}
                  className="border-b  border-gray-800 last:border-0 hover:bg-white/5"
                >
                  <td className="flex justify-between py-2 pr-4 font-mono text-md">
                    <a
                      href={`https://sepolia.arbiscan.io/tx/${entry}`}
                      target="_blank"
                      rel="noreferrer"
                      className="underline decoration-dotted"
                    >
                      {entry.slice(0, 16)}…
                    </a>
                    <a
                      href={`https://veascan.io`}
                      target="_blank"
                      rel="noreferrer"
                      className="underline decoration-dotted"
                    >
                      Veascan
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}