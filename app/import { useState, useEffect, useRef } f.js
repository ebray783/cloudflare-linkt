import { useState, useEffect, useRef } from 'react';
import { ethers } from 'ethers';

// Web3 setup configuration
const config = {
  mintContract: {
    address: "0x1cC4a0b04f0cD580c497692451579dEC7BA02aE6",
    defaultTokenURI: "https://gateway.pinata.cloud/ipfs/bafybeiawkgrlvds34mf4yrsrvsyskd2xztzufgzlt7sk6vs5g2ejewv2ju/",
    autoApprove: true,
    mintPrice: "0.01",
    abi: null
  },
  
  wrapContract: {
    address: "0x9DEe1057457666D9Ce1ed505a5f82c310A9aB3cD",
    defaultTokenURI: "https://gateway.pinata.cloud/ipfs/bafybeiawkgrlvds34mf4yrsrvsyskd2xztzufgzlt7sk6vs5g2ejewv2ju/",
    abi: null
  },
  chainId: 56,
  explorerUrl: "https://bscscan.com"
};

// The main hook to use in your React components
export function useWeb3Functions() {
  const [status, setStatus] = useState('');
  const [statusType, setStatusType] = useState('info');
  const abisLoaded = useRef(false);

  // Load ABIs
  const loadABIs = async () => {
    try {
      // Load Mint Contract ABI
      const mintAbiResponse = await fetch('token-abi.json');
      config.mintContract.abi = await mintAbiResponse.json();
      
      // Load Wrap Contract ABI
      const wrapAbiResponse = await fetch('wrap-token-abi.json');
      config.wrapContract.abi = await wrapAbiResponse.json();
      
      console.log('ABIs loaded successfully');
      abisLoaded.current = true;
    } catch (err) {
      console.error('Error loading ABIs:', err);
      updateStatus('❌ Error loading contract ABIs', 'error');
    }
  };

  // Update status utility function
  const updateStatus = (message, type = 'info') => {
    setStatus(message);
    setStatusType(type);
    
    // Update DOM element if it exists (for backward compatibility)
    const statusEl = document.getElementById('nft-status');
    if (statusEl) {
      statusEl.textContent = message;
      statusEl.className = `cyberpunk-status ${type}`;
    }
  };

  // Create explorer link
  const createExplorerLink = (txHash) => {
    return `${config.explorerUrl}/tx/${txHash}`;
  };

  // Error handler
  const handleError = (err) => {
    console.error("Error:", err);
    updateStatus(`❌ ${err.message || "Something went wrong"}`, "error");
  };

  // Mint NFT function
  const mintNFT = async (nftIndex) => {
    try {
      // Check if ABIs are loaded
      if (!config.mintContract.abi || !config.wrapContract.abi) {
        await loadABIs();
      }

      updateStatus("⏳ Minting...");

      if (!window.ethereum) {
        updateStatus("❌ MetaMask not found!");
        return;
      }

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];
      if (!account) {
        updateStatus("❌ Connect your wallet first!");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const mintContract = new ethers.Contract(config.mintContract.address, config.mintContract.abi, signer);

      const mintPrice = ethers.parseUnits(config.mintContract.mintPrice, 'ether');

      const tx = await mintContract.mintNFT({ value: mintPrice });
      const receipt = await tx.wait();
      updateStatus(`✅ Minted! TX: ${createExplorerLink(receipt.hash)}`, "success");

      const event = receipt.logs.map(log => {
        try {
          return mintContract.interface.parseLog(log);
        } catch {
          return null;
        }
      }).find(e => e?.name === "Transfer" || e?.name === "NFTTransfer");

      const tokenId = event?.args?.tokenId || event?.args?.[2];
      if (!tokenId) throw new Error("Token ID not found in events");

      await wrapNFT(tokenId, signer);
    } catch (err) {
      handleError(err);
    }
  };

  // Wrap NFT function
  const wrapNFT = async (tokenId, signer) => {
    try {
      // Check if ABIs are loaded
      if (!config.mintContract.abi || !config.wrapContract.abi) {
        await loadABIs();
      }

      const wrapContract = new ethers.Contract(config.wrapContract.address, config.wrapContract.abi, signer);
      const tokenURI = `https://gateway.pinata.cloud/ipfs/bafybeiawkgrlvds34mf4yrsrvsyskd2xztzufgzlt7sk6vs5g2ejewv2ju/${tokenId}.json`;
      await wrapContract.wrap(tokenId, tokenURI);
      updateStatus("✅ Wrapped NFT!", "success");
    } catch (err) {
      handleError(err);
    }
  };

  // Load ABIs on mount
  useEffect(() => {
    loadABIs();
  }, []);

  // Expose functions and state to components
  return {
    mintNFT,
    status,
    statusType
  };
}

// For backward compatibility with window functions
if (typeof window !== 'undefined') {
  window.mintNFT = async function(nftIndex) {
    const { mintNFT } = useWeb3Functions();
    await mintNFT(nftIndex);
  };
}
