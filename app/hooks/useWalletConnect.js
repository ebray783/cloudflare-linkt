'use client';

import { useEffect } from 'react';

export function useWalletConnect() {
  useEffect(() => {
    const handleDeepLink = (event) => {
      try {
        const url = event?.url || event?.data;
        if (typeof url === 'string' && url.startsWith('wc:')) {
          window.location.href = url;
        }
      } catch (error) {
        console.error('Error handling deep link:', error);
      }
    };

    // Handle deep linking on mobile
    if (typeof window !== 'undefined') {
      window.addEventListener('url', handleDeepLink);
      window.addEventListener('message', handleDeepLink);

      // Handle initial deep link
      const url = window.location.href;
      if (typeof url === 'string' && url.includes('wc:')) {
        handleDeepLink({ url });
      }
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('url', handleDeepLink);
        window.removeEventListener('message', handleDeepLink);
      }
    };
  }, []);
} 