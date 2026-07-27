import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import {
  arbitrum,
  arbitrumSepolia,
  base,
  baseSepolia,
  gnosisChiado,
  mainnet,
  sepolia,
  story,
} from "@reown/appkit/networks";
import type { AppKitNetwork } from "@reown/appkit/networks";

// Get projectId from https://cloud.reown.com
export const projectId =
  process.env.NEXT_PUBLIC_PROJECT_ID ||
  "b56e18d47c72ab683b10814fe9495694"; // this is a public projectId only to use on localhost

if (!projectId) {
  throw new Error("Project ID is not defined");
}

export const metadata = {
  name: "Hashi Lightbulb",
    description: "Hashi Lightbulb",
    url: "https://localhost:3000",
    icons: ["https://localhost:3000/icon.png"],
};

// for custom networks visit -> https://docs.reown.com/appkit/react/core/custom-networks
export const networks = [
  mainnet,
  base,
  arbitrum,
  story,
  sepolia,
  arbitrumSepolia,
  baseSepolia,
  gnosisChiado,
] as [AppKitNetwork, ...AppKitNetwork[]];

export const getAppKitNetwork = (
  chainId: number
): AppKitNetwork | undefined => networks.find((n) => n.id === chainId);

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks,
});

export const config = wagmiAdapter.wagmiConfig;
