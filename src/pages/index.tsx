import { useEffect, useState } from "react";
import { useAppKitNetwork } from "@reown/appkit/react";
import { useAppKitAccount } from "@reown/appkit/react";
import { DEFAULT_ROUTE, Route } from "@/utils/consts";
import { Header } from "@/components/Header";
import { LightbulbControls } from "@/components/LightBulbControls";
import { HistoryTable, HistoryEntry } from "@/components/HistoryDialog";
import { LightbulbStatusDialog } from "@/components/LightBulbStatus";
import { Geist, Geist_Mono } from "next/font/google";
import { createAppKit } from "@reown/appkit/react";

import { WagmiProvider } from "wagmi";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  projectId,
  metadata,
  networks,
  wagmiAdapter,
  getAppKitNetwork,
} from "@/utils/wagmi";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const queryClient = new QueryClient();

const generalConfig = {
  projectId,
  networks,
  metadata,
  themeMode: "light" as const,
  themeVariables: {
    "--w3m-accent": "#000000",
  },
};

createAppKit({
  adapters: [wagmiAdapter],
  ...generalConfig,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
  },
  themeVariables: {
    "--w3m-font-family":
      '"Geist", ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial',
    "--w3m-accent": "#2563EB",
    "--w3m-color-mix-strength": 100,
  },
});

export default function Home() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [route, setRoute] = useState<Route>(DEFAULT_ROUTE);
  const { chainId: connectedChainId, switchNetwork } = useAppKitNetwork();
  const { address, isConnected } = useAppKitAccount();
  console.log("Connected chainId", connectedChainId);

  // keep the wallet on the route's source (Switch) chain
  useEffect(() => {
    if (!isConnected || Number(connectedChainId) === route.source) return;
    const network = getAppKitNetwork(route.source);
    if (network) switchNetwork(network);
  }, [isConnected, connectedChainId, route.source, switchNetwork]);

  useEffect(() => {
    const stored = localStorage.getItem("lightbulbHistory");
    if (stored) {
      try {
        const parsed: HistoryEntry[] = JSON.parse(stored);
        // drop entries from the previous, destination-only history format and
        // dedupe by switch tx hash (cleans up history saved before the
        // duplicate-append fix)
        const seen = new Set<string>();
        const cleaned = parsed.filter((entry) => {
          if (!entry.source || !entry.destination) return false;
          if (seen.has(entry.switchTx)) return false;
          seen.add(entry.switchTx);
          return true;
        });
        if (cleaned.length !== parsed.length) {
          localStorage.setItem("lightbulbHistory", JSON.stringify(cleaned));
        }
        setHistory(cleaned);
      } catch (e) {
        console.error("Failed to parse history from localStorage", e);
      }
    }
  }, [setHistory]);

  return (
    <div
      className={`${geistSans.className} ${geistMono.className} font-sans grid grid-rows-[20px_1fr_20px] items-center min-h-screen p-8 pb-20 gap-16 sm:p-20`}
    >
      <WagmiProvider config={wagmiAdapter.wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <>
            <Header />
            <div className="flex w-full mb-40 justify-around">
              <LightbulbControls
                {...{
                  setHistory,
                  route,
                }}
              />
              <LightbulbStatusDialog {...{ address, route, setRoute }} />
            </div>
            {history.length > 0 && <HistoryTable {...{ history }} />}
          </>
        </QueryClientProvider>
      </WagmiProvider>
    </div>
  );
}
