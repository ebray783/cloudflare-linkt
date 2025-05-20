'use client';

import { useAccount } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';

export default function CustomConnectButton() {
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  return (
    <button
      onClick={openConnectModal}
      className="cyberpunk-btn connect-wallet-btn"
    >
      {isConnected ? `Connected: ${address?.slice(0, 6)}...${address?.slice(-4)}` : 'Connect Wallet'}
    </button>
  );
}
