"use client";

import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider, connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  rainbowWallet,
  walletConnectWallet,
  metaMaskWallet,
  trustWallet,
  ledgerWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum, base, zora } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useWalletConnect } from './hooks/useWalletConnect';

const bsc = {
  id: 56,
  name: 'BNB Chain',
  network: 'bsc',
  nativeCurrency: {
    decimals: 18,
    name: 'BNB',
    symbol: 'BNB',
  },
  rpcUrls: {
    default: { http: ['https://bsc-dataseed.binance.org/'] },
    public: { http: ['https://bsc-dataseed.binance.org/'] },
  },
  blockExplorers: {
    default: { name: 'BscScan', url: 'https://bscscan.com' },
  },
  testnet: false,
};

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    bsc,
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    zora,
  ],
  [publicProvider()]
);

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [
        rainbowWallet({ projectId: 'ff2db6544a529027450c74a34fc4fb74', chains }),
        walletConnectWallet({ projectId: 'ff2db6544a529027450c74a34fc4fb74', chains }),
        metaMaskWallet({ projectId: 'ff2db6544a529027450c74a34fc4fb74', chains }),
        trustWallet({ projectId: 'ff2db6544a529027450c74a34fc4fb74', chains }),
        ledgerWallet({ projectId: 'ff2db6544a529027450c74a34fc4fb74', chains }),
      ],
    },
  ]
);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
  chains,
});

const queryClient = new QueryClient();

export function Providers({ children }) {
  useWalletConnect();

  return (
    <WagmiConfig config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          chains={chains}
          modalSize="compact"
          initialChain={bsc}
          appInfo={{
            appName: 'FPV Token',
            learnMoreUrl: 'https://fpvtoken.com',
          }}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiConfig>
  );
} 