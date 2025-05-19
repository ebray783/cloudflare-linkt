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
import { bscTestnet } from "wagmi/chains"; // Import BSC testnet chain
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

const projectId = "ff2db6544a529027450c74a34fc4fb74";

// Configure only BSC testnet chain with Ankr RPC
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [bscTestnet],
  [
    jsonRpcProvider({
      rpc: () => ({
        http: "https://rpc.ankr.com/bsc/ff8812608db2dae8d151920926ff81405b7c135d3a73b05c496616c135b07f32",
      }),
    }),
  ]
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
        initialChain={97} // Force BSC testnet as the initial chain
      >
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default Providers;
