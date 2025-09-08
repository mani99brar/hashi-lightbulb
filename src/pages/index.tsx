import { useEffect, useState } from "react";
import { useAppKitNetwork } from "@reown/appkit/react";
import { arbitrumSepolia, gnosisChiado } from "viem/chains";
import { Header } from "@/components/Header";
import { LightbulbControls } from "@/components/LightBulbControls";
import { HistoryTable, HistoryEntry } from "@/components/HistoryDialog";
import { LightbulbStatusDialog } from "@/components/LightBulbStatus";
import { Geist, Geist_Mono } from "next/font/google";
import { createAppKit } from "@reown/appkit/react";

import { WagmiProvider } from "wagmi";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { projectId, metadata, networks, wagmiAdapter } from "@/utils/wagmi";

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
  const [lightbulbChainId, setLightbulbChainId] = useState<number>(
    gnosisChiado.id
  );
  const { chainId: connectedChainId } = useAppKitNetwork();
  console.log("Connected chainId", connectedChainId);

  useEffect(() => {
    const stored = localStorage.getItem(`lightbulbHistory-${lightbulbChainId}`);
    if (stored) {
      try {
        const parsed: HistoryEntry[] = JSON.parse(stored);
        setHistory(parsed);
      } catch (e) {
        console.error("Failed to parse history from localStorage", e);
      }
    }
  }, [setHistory, lightbulbChainId]);

  return (
    <div
      className={`${geistSans.className} ${geistMono.className} font-sans grid grid-rows-[20px_1fr_20px] items-center min-h-screen p-8 pb-20 gap-16 sm:p-20`}
    >
      <WagmiProvider config={wagmiAdapter.wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <>
            <Header />
            <div className="flex w-full justify-around">
              <LightbulbControls
                {...{
                  setHistory,
                  lightbulbChainId,
                }}
              />
              <LightbulbStatusDialog
                lightbulbChainId={lightbulbChainId}
                setLightbulbChainId={setLightbulbChainId}
              />
            </div>
            {history.length > 0 && (
              <HistoryTable
                {...{ chainId: connectedChainId as number, history }}
              />
            )}
          </>
        </QueryClientProvider>
      </WagmiProvider>
    </div>
  );
}
