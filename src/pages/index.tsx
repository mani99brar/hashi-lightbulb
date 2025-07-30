import { Header } from "@/components/Header";
import { LightbulbControls } from "@/components/LightBulbControls";
import { Geist, Geist_Mono } from "next/font/google";
import { useEffect, useState } from "react";
import { Address } from "viem";
import { LightbulbStatusDialog } from "@/components/LightBulbStatus";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const [isWindowLoaded, setIsWindowLoaded] = useState(false);
  const [account, setAccount] = useState<Address | null>(null);
  const [isOn, setIsOn] = useState<boolean>(false);

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
        console.error(
          "Ethereum provider not found. Make sure MetaMask is installed."
        );
      }
    };
    initializeWalletClient();
  }, []);

  return (
    <div
      className={`${geistSans.className} ${geistMono.className} font-sans h-screen p-8 sm:p-20`}
    >
      {isWindowLoaded && (
        <>
          <Header account={account} setAccount={setAccount} />
          <div className="flex flex-col items-center justify-center h-full">
            <LightbulbStatusDialog setIsOn={setIsOn} />
            <div className="flex w-full justify-around">
              <LightbulbControls account={account} isOn={isOn} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
