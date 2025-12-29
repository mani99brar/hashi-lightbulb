import { useEffect, useState } from "react";
import { useAppKitNetwork } from "@reown/appkit/react";
import { useAppKitAccount } from "@reown/appkit/react";
import { gnosisChiado, sepolia } from "viem/chains";
import { Header } from "@/components/Header";
import { HistoryTable } from "@/components/HistoryDialog";
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
  const [history, setHistory] = useState<string[]>([]);
  const [lightbulbChainId, setLightbulbChainId] = useState<number>(sepolia.id);
  const { chainId: connectedChainId } = useAppKitNetwork();
  const { address } = useAppKitAccount();
  console.log("Connected chainId", connectedChainId);

  useEffect(() => {
    const stored = localStorage.getItem(
      `VeaLightbulbHistory-${lightbulbChainId}`
    );
    if (stored) {
      try {
        const parsed: string[] = JSON.parse(stored);
        setHistory(parsed);
      } catch (e) {
        console.error("Failed to parse history from localStorage", e);
      }
    } else {
      setHistory([]);
    }
  }, [setHistory, lightbulbChainId]);

  return (
    <div
      className={`${geistSans.className} ${geistMono.className} font-sans grid grid-rows-[20px_1fr_20px] justify-around items-center min-h-screen p-8 pb-20 gap-8 sm:p-20`}
    >
      <WagmiProvider config={wagmiAdapter.wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <>
            <Header />
            <div className="flex w-full justify-around">
              {/* <LightbulbControls
                {...{
                  setHistory,
                  lightbulbChainId,
                }}
              /> */}
              <LightbulbStatusDialog
                {...{
                  address,
                  lightbulbChainId,
                  setLightbulbChainId,
                  setHistory,
                }}
              />
            </div>
            <div className="flex w-full justify-center mb-40">
              {history.length > 0 && (
                <HistoryTable
                  {...{ chainId: lightbulbChainId as number, history }}
                />
              )}
            </div>
          </>
        </QueryClientProvider>
      </WagmiProvider>
    </div>
  );
}
