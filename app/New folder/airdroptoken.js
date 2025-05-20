"use client";
import { useState, useEffect, useCallback } from "react";
import { useAccount, useChainId, useWriteContract, useReadContract, useWaitForTransactionReceipt } from "wagmi";
import { useSwitchNetwork } from "wagmi/actions";
import { parseEther } from "viem";
import CustomConnectButton from "./components/CustomConnectButton";
import { cleanErrorMessage, formatTransactionError } from "./utils/errorHandlers";

// Your contract config
const contractConfig = {
  address: "0x4419869F1A75C65C8e9Ef503A6fB6E5e36Ae990B",
  abi:[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"claimant","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"feePaid","type":"uint256"}],"name":"AirdropClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"NFTTransfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"ownerAddr","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"recipients","type":"address[]"}],"name":"bulkAirdropNFT","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"buyTokens","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"claimAirdrop","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"claimFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getNFTsOwned","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"hasClaimed","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"maxNFTSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"mintNFT","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"ownerAddr","type":"address"}],"name":"nftBalanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"nftOwners","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"nftPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"ownsNFT","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"uri","type":"string"}],"name":"setBaseURI","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"newFee","type":"uint256"}],"name":"setClaimFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"newPrice","type":"uint256"}],"name":"setMintPrice","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"newRate","type":"uint256"}],"name":"setTokensPerBNB","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tokensPerBNB","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalNFTsMinted","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferNFT","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdrawBNB","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]
    }
    
const BSC_TESTNET = {
  id: 97,
  name: 'BSC Testnet',
  network: 'bsc-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'BNB',
    symbol: 'tBNB',
  },
  rpcUrls: {
    default: { http: ['https://data-seed-prebsc-1-s1.binance.org:8545'] },
    public: { http: ['https://data-seed-prebsc-1-s1.binance.org:8545'] },
  },
  blockExplorers: {
    default: { name: 'BscScan', url: 'https://testnet.bscscan.com' },
  },
  testnet: true,
};

export default function AirdropClaim() {
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [transactionHistory, setTransactionHistory] = useState([]);

  // Initialize hooks
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const switchNetwork = useSwitchNetwork();
  const { writeContract, isPending: isTxPending, error: writeError, data: txData } = useWriteContract();

  // Set mounted state
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Only run contract reads if mounted (client-side) and address is available
  const shouldRead = typeof window !== 'undefined' && mounted && !!address;

  // Read hasClaimed
  const hasClaimedResult = useReadContract({
    ...contractConfig,
    functionName: "hasClaimed",
    args: shouldRead ? [address] : undefined,
    query: {
      enabled: shouldRead,
    }
  });
  const hasClaimed = hasClaimedResult.data ?? false;
  const refetchHasClaimed = hasClaimedResult.refetch;

  // Read ownsNFT
  const ownsNFTResult = useReadContract({
    ...contractConfig,
    functionName: "ownsNFT",
    args: shouldRead ? [address] : undefined,
    query: {
      enabled: shouldRead,
    }
  });
  const ownsNFT = ownsNFTResult.data ?? false;

  // Read claimFee
  const claimFeeResult = useReadContract({
    ...contractConfig,
    functionName: "claimFee",
    query: {
      enabled: shouldRead,
    }  });
  const claimFee = claimFeeResult.data;

  // Check if any contract reads are loading
  const isContractLoading = hasClaimedResult.isPending || ownsNFTResult.isPending || claimFeeResult.isPending;

  // Handle contract read errors
  const contractReadError = hasClaimedResult.error || ownsNFTResult.error || claimFeeResult.error;
  
  // Wait for transaction confirmation
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txData,
  });

  // Update status on success
  useEffect(() => {
    if (isSuccess) {
      setStatus("✅ Airdrop successfully claimed!");
      refetchHasClaimed();
    }
  }, [isSuccess, refetchHasClaimed]);

  useEffect(() => {
    if (isSuccess && txData) {
      setTransactionHistory(prev => [...prev, {
        hash: txData,
        timestamp: new Date().toISOString(),
        status: 'success'
      }]);
    }
  }, [isSuccess, txData]);

  const handleClaim = useCallback(async () => {
    try {
      if (!isConnected) {
        setStatus("❌ Please connect your wallet.");
        return;
      }
      if (chainId !== 97 && switchNetwork) {
        await switchNetwork(97);
        setStatus("❌ Please switch to BSC Testnet.");
        return;
      }
      if (hasClaimed) {
        setStatus("❌ You have already claimed your airdrop.");
        return;
      }
      
      setStatus("⏳ Claiming airdrop...");
      writeContract({
        ...contractConfig,
        functionName: "claimAirdrop",
        args: [parseEther("10000")],
        value: claimFee,
      });
    } catch (err) {
      console.error('Claim error:', err);
      setStatus(`❌ ${formatTransactionError(err)}`);
    }
  }, [isConnected, chainId, hasClaimed, writeContract, claimFee, switchNetwork]);

  // Update status when waiting for confirmation
  useEffect(() => {
    if (txData) {
      setStatus("⏳ Waiting for confirmation...");
    }
  }, [txData]);

  const { data: gasEstimate } = useReadContract({
    ...contractConfig,
    functionName: "claimAirdrop",
    args: [parseEther("10000")],
    value: claimFee,
  });

  const validateInput = (amount) => {
    if (!amount || amount <= 0) {
      throw new Error("Invalid amount");
    }
    // Add more validation as needed
  };

  const handleRetry = async () => {
    if (!txData) return;
    
    setStatus("⏳ Retrying transaction...");
    try {
      writeContract({
        ...contractConfig,
        functionName: "claimAirdrop",
        args: [parseEther("10000")],
        value: claimFee,
      });
    } catch (err) {
      setStatus(`❌ ${formatTransactionError(err)}`);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div>
      <button
        data-testid="claim-button"
        aria-label="Claim Airdrop"
        aria-busy={isTxPending || isContractLoading}
        type="button"
        onClick={handleClaim}
        disabled={isLoading || isTxPending || hasClaimed || isContractLoading || isConfirming}
        style={{ marginTop: 16, cursor: (isLoading || isTxPending || hasClaimed || isContractLoading || isConfirming) ? 'not-allowed' : 'pointer' }}
        className="cyberpunk-btn"
      >
        {isTxPending ? "Processing..." : isContractLoading ? "Loading..." : "Claim Airdrop"}
      </button>
      {status && <div style={{ marginTop: 8 }}>{status}</div>}
      {contractReadError && (
        <div style={{ color: 'red', marginTop: 8 }}>
          Contract Read Error: {cleanErrorMessage(contractReadError.message)}
        </div>
      )}
      {writeError && (
        <div style={{ color: 'red', marginTop: 8 }}>
          Write Error: {cleanErrorMessage(writeError.message)}
        </div>
      )}
    </div>
  );
}