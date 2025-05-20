'use client';

import { useCallback } from 'react';
import { useNetwork, useSwitchNetwork } from 'wagmi';
import { mainnet } from 'wagmi/chains';

export function useChainSwitch() {
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  const handleChainSwitch = useCallback(async (targetChainId) => {
    try {
      if (chain?.id !== targetChainId) {
        await switchNetwork?.(targetChainId);
      }
    } catch (error) {
      console.error('Error switching chain:', error);
      // Fallback to mainnet if switch fails
      if (targetChainId !== mainnet.id) {
        try {
          await switchNetwork?.(mainnet.id);
        } catch (fallbackError) {
          console.error('Error switching to mainnet:', fallbackError);
        }
      }
    }
  }, [chain, switchNetwork]);

  return { handleChainSwitch };
} 