// --- Web3Modal v2 Setup ---
const projectId = 'ff2db6544a529027450c74a34fc4fb74' // Replace with your WalletConnect Project ID
const metadata = {
  name: 'My Dapp',
  description: 'My Dapp Description',
  url: 'https://yourdomain.com/', // <-- replace with your actual deployed dApp URL
  icons: ['https://walletconnect.com/walletconnect-logo.png']
}

// Configuration object
const config = {
  mintContract: {
    address: "0x4419869F1A75C65C8e9Ef503A6fB6E5e36Ae990B",
    defaultTokenURI: "https://gateway.pinata.cloud/ipfs/bafybeiawkgrlvds34mf4yrsrvsyskd2xztzufgzlt7sk6vs5g2ejewv2ju/",
    autoApprove: true,
    mintPrice: "0.01",
    abi: null  // Will be loaded from token-abi.json
  },
  
  wrapContract: {
    address: "0xedd1b47cbc3b4ac2062c8ea75cf258d6afaa0f57",
    defaultTokenURI: "https://gateway.pinata.cloud/ipfs/bafybeiawkgrlvds34mf4yrsrvsyskd2xztzufgzlt7sk6vs5g2ejewv2ju/",
    abi: null  // Will be loaded from wrap-token-abi.json
  },
  chainId: 56,
  explorerUrl: "https://bscscan.com"
};

// Utility Functions
function createExplorerLink(txHash) {
  return `${config.explorerUrl}/tx/${txHash}`;
}

// Modified version for React compatibility
const setupWeb3Functions = () => {
  // --- Load ABIs ---
  async function loadABIs() {
    try {
      // Load Mint Contract ABI
      const mintAbiResponse = await fetch('token-abi.json');
      config.mintContract.abi = await mintAbiResponse.json();
      
      // Load Wrap Contract ABI
      const wrapAbiResponse = await fetch('wrap-token-abi.json');
      config.wrapContract.abi = await wrapAbiResponse.json();
      
      console.log('ABIs loaded successfully');
    } catch (err) {
      console.error('Error loading ABIs:', err);
      updateStatus('❌ Error loading contract ABIs', 'error');
    }
  }

  // --- Utility Functions ---
  function updateStatus(message, type = 'info') {
    const statusEl = document.getElementById('nft-status');
    if (statusEl) {
      statusEl.textContent = message;
      statusEl.className = `cyberpunk-status ${type}`;
    }
  }

  function handleError(err) {
    console.error("Error:", err);
    updateStatus(`❌ ${err.message || "Something went wrong"}`, "error");
  }

  // --- Wrap NFT ---
  async function wrapNFT(tokenId, signer) {
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
  }

  // --- Mint NFT ---
  async function mintNFT(nftIndex, event) {
    // Prevent default behavior if event is provided
    if (event && event.preventDefault) {
      event.preventDefault();
    }
    
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
  }

  // Initialize
  if (typeof window !== 'undefined') {
    // Load ABIs when the component mounts
    loadABIs();

    // Expose mintNFT to global scope for React components
    window.mintNFT = mintNFT;
    
    // Add a connect wallet function that doesn't scroll
    window.connectWalletNoScroll = async (event) => {
      if (event) {
        event.preventDefault();
      }
      
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          console.log("Connected to account:", accounts[0]);
          
          // Find and update status elements if they exist
          const statusEl = document.getElementById('walletAddress');
          if (statusEl) {
            statusEl.textContent = `Connected: ${accounts[0]}`;
            statusEl.className = 'cyberpunk-status connected';
          }
          
          // Enable mint button if it exists
          const mintBtn = document.getElementById('mainMintBtn');
          if (mintBtn) {
            mintBtn.disabled = false;
            mintBtn.onclick = (e) => {
              e.preventDefault();
              window.mintNFT(1, e);
            };
          }
          
          return accounts[0];
        } catch (err) {
          console.error("Failed to connect wallet:", err);
          return null;
        }
      } else {
        console.error("No Ethereum wallet found");
        return null;
      }
    };
  }

  // Return functions for use in React components
  return {
    mintNFT,
    loadABIs
  };
};

// Initialize when loaded
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    // Setup mint button if exists (for non-React usage)
    const mainMintBtn = document.getElementById("mainMintBtn");
    const connectBtn = document.getElementById("connectWalletBtn");
    const nftSelect = document.getElementById("nftSelect");

    // Fix mint button
    if (mainMintBtn) {
      mainMintBtn.onclick = (e) => {
        e.preventDefault();
        const nftIndex = nftSelect ? nftSelect.value : 1;
        window.mintNFT(nftIndex, e);
      };
    }
    
    // Fix connect button
    if (connectBtn) {
      connectBtn.onclick = (e) => {
        e.preventDefault();
        window.connectWalletNoScroll(e);
      };
    }
  });
}

// Export for React
export default setupWeb3Functions;