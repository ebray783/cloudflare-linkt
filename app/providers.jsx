"use client";

import * as React from 'react';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { bsc } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createConfig } from 'wagmi';
import {
  metaMaskWallet,
  trustWallet,
  rainbowWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { http } from 'viem';

const projectId = "ff2db6544a529027450c74a34fc4fb74";

// Configure available wallets
const wallets = [
  {
    groupName: 'Popular',
    wallets: [
      metaMaskWallet,
      trustWallet,
      rainbowWallet,
    ],
  },
];

// Configure wagmi config
const config = createConfig({
  chains: [bsc],
  transports: {
    [bsc.id]: http()
  }
});

// Create a client for tanstack query
const queryClient = new QueryClient();

export function Providers({ children }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          chains={[bsc]}
          id={projectId}
          appInfo={{
            appName: "FPV Token",
            learnMoreUrl: "https://fpvtoken.com",
          }}
          modalSize="compact"
          showRecentTransactions={true}
          coolMode={true}
        >
          {mounted && children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}