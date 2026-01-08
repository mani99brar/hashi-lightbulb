import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { sepolia, arbitrumSepolia, gnosisChiado } from "@reown/appkit/networks";
import type { AppKitNetwork } from "@reown/appkit/networks";

// Get projectId from https://cloud.reown.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID!;

if (!projectId) {
  console.log(projectId);
  throw new Error("Project ID is not defined");
}

export const metadata = {
  name: "Hashi Lightbulb",
    description: "Hashi Lightbulb",
    url: "https://localhost:3000",
    icons: ["https://localhost:3000/icon.png"],
};

// for custom networks visit -> https://docs.reown.com/appkit/react/core/custom-networks
export const networks = [arbitrumSepolia] as [
  AppKitNetwork,
  ...AppKitNetwork[]
];

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks,
});

export const config = wagmiAdapter.wagmiConfig;
