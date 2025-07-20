import { Header } from "@/components/Header";
import { LightbulbControls } from "@/components/LightBulbControls";
import { HistoryTable, HistoryEntry } from "@/components/HistoryDialog";
import { LightbulbStatusDialog } from "@/components/LightBulbStatus";
import { Geist, Geist_Mono } from "next/font/google";
import { useEffect, useState } from "react";
import { Address } from "viem";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const [ history, setHistory ] = useState<HistoryEntry[]>([]);
  const [isWindowLoaded, setIsWindowLoaded] = useState(false);
  const [account, setAccount] = useState<Address | null>(null);

  useEffect(() => {
    console.log(window.ethereum);
    // Ensure the wallet client is initialized when the app loads
    const initializeWalletClient = async () => {
      // Ensurre window.ethereum is available
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          // Request account access if needed
          await window.ethereum.request({ method: "eth_requestAccounts" });
          setIsWindowLoaded(true);
        } catch (error) {
          console.error("User denied account access or error occurred:", error);
        }
      } else {
        console.error("Ethereum provider not found. Make sure MetaMask is installed.");
      }
    };
    initializeWalletClient();
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("lightbulbHistory");
    if (stored) {
      try {
        const parsed: HistoryEntry[] = JSON.parse(stored);
        setHistory(parsed);
      } catch (e) {
        console.error("Failed to parse history from localStorage", e);
      }
    }
  }, [setHistory]);


  return (
    <div
      className={`${geistSans.className} ${geistMono.className} font-sans grid grid-rows-[20px_1fr_20px] items-center min-h-screen p-8 pb-20 gap-16 sm:p-20`}
    >
      {isWindowLoaded && (
        <>
          <Header account={account} setAccount={setAccount} />
          <div className="flex w-full justify-around">
            <LightbulbControls account={account} setHistory={setHistory} />
            <LightbulbStatusDialog
            />
          </div>
          {history.length > 0 && (
            <HistoryTable
              account={account!}
              history={history}
            />
          )}
        </>
      )}
    </div>
  );
}
