"use client";
import { useState, useEffect } from "react";
import { useAccount, useNetwork, useSwitchNetwork, useContractWrite, usePrepareContractWrite, useContractRead, useWaitForTransaction } from "wagmi";
import { parseEther } from "viem";
import { ConnectButton } from "@rainbow-me/rainbowkit";

// Your contract config
const contractConfig = {
  address: "0x1cC4a0b04f0cD580c497692451579dEC7BA02aE6",
  abi:[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"claimant","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"feePaid","type":"uint256"}],"name":"AirdropClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"NFTTransfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"ownerAddr","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"recipients","type":"address[]"}],"name":"bulkAirdropNFT","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"buyTokens","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"claimAirdrop","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"claimFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getNFTsOwned","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"hasClaimed","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"maxNFTSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"mintNFT","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"ownerAddr","type":"address"}],"name":"nftBalanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"nftOwners","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"nftPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"ownsNFT","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"uri","type":"string"}],"name":"setBaseURI","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"newFee","type":"uint256"}],"name":"setClaimFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"newPrice","type":"uint256"}],"name":"setMintPrice","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"newRate","type":"uint256"}],"name":"setTokensPerBNB","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tokensPerBNB","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalNFTsMinted","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferNFT","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdrawBNB","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]
    }
    
export default function AirdropClaim() {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Only render after client mount to avoid hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Only run contract reads if mounted (client-side) and address is available
  const shouldRead = typeof window !== 'undefined' && mounted && !!address;

  // Read hasClaimed
  const hasClaimedResult = useContractRead({
    ...contractConfig,
    functionName: "hasClaimed",
    args: shouldRead ? [address] : undefined,
    enabled: shouldRead,
  });
  const hasClaimed = hasClaimedResult.data ?? false;
  const refetchHasClaimed = hasClaimedResult.refetch;

  // Read ownsNFT
  const ownsNFTResult = useContractRead({
    ...contractConfig,
    functionName: "ownsNFT",
    args: shouldRead ? [address] : undefined,
    enabled: shouldRead,
  });
  const ownsNFT = ownsNFTResult.data ?? false;

  // Read claimFee
  const claimFeeResult = useContractRead({
    ...contractConfig,
    functionName: "claimFee",
    enabled: shouldRead,
  });
  const claimFee = claimFeeResult.data;

  // Check if any contract reads are loading
  const isContractLoading = hasClaimedResult.isLoading || ownsNFTResult.isLoading || claimFeeResult.isLoading;

  // Handle contract read errors
  const contractReadError = hasClaimedResult.error || ownsNFTResult.error || claimFeeResult.error;
  // Prepare claim airdrop
  const { config, error: prepareError, isError: isPrepareError } = usePrepareContractWrite({
    ...contractConfig,
    functionName: "claimAirdrop",
    args: [parseEther("10000")],
    value: claimFee,
    enabled: shouldRead && !isContractLoading && !contractReadError && !hasClaimed && claimFee !== undefined,
  });  const { write, isLoading: isTxLoading, error: writeError, isError: isWriteError, data: txData } = useContractWrite({
    ...config,
    onError: (err) => {
      setStatus(`❌ ${err.message || "Something went wrong"}`);
    },
  });

  // Wait for transaction confirmation
  const { isLoading: isConfirming } = useWaitForTransaction({
    hash: txData?.hash,
    onSuccess: () => {
      setStatus("✅ Airdrop successfully claimed!");
      refetchHasClaimed();
    },
    onError: (error) => {
      setStatus(`❌ Transaction failed: ${error.message}`);
    },
  });

  const handleClaim = async () => {
    if (!isConnected) {
      setStatus("❌ Please connect your wallet.");
      return;
    }
    if (chain?.id !== 56 && switchNetwork) {
      try {
        await switchNetwork(56);
      } catch (error) {
        setStatus("❌ Please manually switch to BSC Mainnet in your wallet");
        return;
      }
      return;
    }
    if (hasClaimed) {
      setStatus("❌ You have already claimed your airdrop.");
      return;
    }
    if (isPrepareError) {
      setStatus(`❌ Prepare error: ${prepareError?.message || "Unknown error"}`);
      return;
    }    setStatus("⏳ Claiming airdrop...");
    write?.();
  };

  // Update status when waiting for confirmation
  useEffect(() => {
    if (txData?.hash) {
      setStatus("⏳ Waiting for confirmation...");
    }
  }, [txData?.hash]);

  if (!mounted) return null;

  return (
    <div>
      <button
        type="button"
        onClick={handleClaim}
        disabled={isLoading || isTxLoading || hasClaimed || isPrepareError || isWriteError || isContractLoading}
        style={{ marginTop: 16, cursor: (isLoading || isTxLoading || hasClaimed || isPrepareError || isWriteError || isContractLoading) ? 'not-allowed' : 'pointer' }}
      >
        {isTxLoading ? "Processing..." : isContractLoading ? "Loading..." : "Claim Airdrop"}
      </button>
      {status && <div style={{ marginTop: 8 }}>{status}</div>}
      {contractReadError && (
        <div style={{ color: 'red', marginTop: 8 }}>
          Contract Read Error: {contractReadError.message}
        </div>
      )}
      {isPrepareError && (
        <div style={{ color: 'red', marginTop: 8 }}>
          Prepare Error: {prepareError?.message}
        </div>      )}      {isWriteError && (
        <div style={{ color: 'red', marginTop: 8 }}>
          Write Error: {writeError?.message}
        </div>
      )}
    </div>
  );
}
