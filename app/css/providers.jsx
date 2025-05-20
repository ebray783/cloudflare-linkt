"use client";

import React from "react";
import {
  RainbowKitProvider,
  getDefaultWallets,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import {
  argentWallet,
  trustWallet,
  ledgerWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { bsc } from "wagmi/chains"; // Import BSC chain
import { publicProvider } from "wagmi/providers/public";

const projectId = "ff2db6544a529027450c74a34fc4fb74";

// Configure only BSC chain
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [bsc], // Only BSC mainnet (chain ID 56)
  [publicProvider()]
);

const { wallets } = getDefaultWallets({
  appName: "FPV Token App",
  projectId,
  chains,
});

const appInfo = {
  appName: "FPV Token",
};

const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: "Other",
    wallets: [
      argentWallet({ projectId, chains }),
      trustWallet({ projectId, chains }),
      ledgerWallet({ projectId, chains }),
    ],
  },
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

const Providers = ({ children }) => {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        chains={chains}
        appInfo={appInfo}
        modalSize="compact"
        initialChain={56} // Force BSC as the initial chain
      >
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default Providers;