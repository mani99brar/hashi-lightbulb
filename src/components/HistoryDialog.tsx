import React from "react";
import { CHAIN_BY_ID } from "@/utils/viem";
import { Bridges, TESTNET_CHAIN_IDS } from "@/utils/consts";

export interface HistoryEntry {
  /** chain the Switch transaction was sent on */
  source: number;
  /** chain the Lightbulb lives on */
  destination: number;
  threshold: number;
  /** which bridges were selected for this message */
  bridgeNames: Bridges[];
  /** original switch transaction hash */
  switchTx: string;
}

interface HistoryTableProps {
  history: HistoryEntry[];
}

const ALL_BRIDGES = Object.values(Bridges);

function bridgeStatusLink(
  bridge: Bridges,
  entry: HistoryEntry,
): string | undefined {
  const isTestnet = TESTNET_CHAIN_IDS.includes(entry.source);
  switch (bridge) {
    case Bridges.LZ:
      return `https://${isTestnet ? "testnet." : ""}layerzeroscan.com/tx/${
        entry.switchTx
      }`;
    case Bridges.CCIP:
      return "https://ccip.chain.link/";
    case Bridges.DEBRIDGE:
      return "https://app.debridge.finance/transactions";
    default:
      return undefined;
  }
}

export function HistoryTable({ history }: HistoryTableProps) {
  const [isDeleted, setIsDeleted] = React.useState(false);

  const onDelete = () => {
    localStorage.setItem("lightbulbHistory", JSON.stringify([]));
    setIsDeleted(true);
  };

  if (isDeleted) {
    return;
  }
  return (
    <div className="mx-auto overflow-scroll mt-40 bg-black border-2 border-white w-full rounded-lg shadow-md p-6">
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
              <th className="pb-2 border-b w-1/6">Route</th>
              <th className="pb-2 border-b w-1/6">Switch TXN</th>
              {ALL_BRIDGES.map((bridge) => (
                <th key={bridge} className="pb-2 border-b w-1/6">
                  {bridge}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {history.map((entry) => {
              const explorer =
                CHAIN_BY_ID[entry.source]?.blockExplorers?.default.url;
              return (
                <tr key={entry.switchTx}>
                  <td className="py-2">
                    {CHAIN_BY_ID[entry.source]?.name ?? entry.source} →{" "}
                    {CHAIN_BY_ID[entry.destination]?.name ?? entry.destination}
                  </td>
                  <td className="py-2">
                    <a
                      href={`${explorer}/tx/${entry.switchTx}`}
                      target="_blank"
                      className="text-blue-600 hover:underline"
                    >
                      {entry.switchTx.slice(0, 6)}…{entry.switchTx.slice(-4)}
                    </a>
                  </td>
                  {ALL_BRIDGES.map((bridge) => {
                    const isUsed = entry.bridgeNames?.includes(bridge);
                    const link = bridgeStatusLink(bridge, entry);
                    return (
                      <td key={bridge} className="py-2">
                        {isUsed ? (
                          link ? (
                            <a
                              href={link}
                              target="_blank"
                              className="text-blue-600 hover:underline"
                            >
                              Status
                            </a>
                          ) : (
                            <span>Used</span>
                          )
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
