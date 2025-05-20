"use client";

import { useState, useCallback } from "react";
import { useAccount, useNetwork, useContractWrite, useWaitForTransaction, useContractRead } from "wagmi";
import { parseEther } from "viem";
import { mainnet, sepolia } from 'wagmi/chains';

// --- Contract Config ---
const config = {
  chainId: 97, // BSC Testnet
  mintContract: {
    address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    abi: [
      {
        "inputs": [],
        "name": "mintNFT",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
      }
    ],
    mintPrice: "0.01"
  },
  wrapContract: {
    address: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
    abi: [
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "uri",
            "type": "string"
          }
        ],
        "name": "wrap",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ],
    defaultTokenURI: "ipfs://QmYourDefaultTokenURI"
  }
};

// Custom hooks for Web3 functionality
export const useMintNFT = () => {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { writeAsync: mintNFT, isLoading: isMinting, error: mintError } = useContractWrite({
    address: config.mintContract.address,
    abi: config.mintContract.abi,
    functionName: 'mintNFT',
  });
  
  const mint = useCallback(async (amount = 1) => {
    try {
      if (!isConnected) {
        throw new Error("Please connect your wallet first");
      }
      
      if (chain?.id !== config.chainId) {
        throw new Error(`Please switch to the correct network (Chain ID: ${config.chainId})`);
      }
      
      const result = await mintNFT({
        value: parseEther(config.mintContract.mintPrice)
      });
      
      return {
        isLoading: isMinting,
        error: mintError,
        txHash: result.hash,
        isSuccess: !!result.hash
      };
    } catch (err) {
      return {
        isLoading: false,
        error: err?.message || "Minting failed",
        txHash: null,
        isSuccess: false
      };
    }
  }, [isConnected, chain, mintNFT, isMinting, mintError]);
  
  return mint;
};

// Hook for minting and wrapping NFTs
export const useMintAndWrapNFT = () => {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { writeAsync: mintNFT, isLoading: isMinting } = useContractWrite({
    address: config.mintContract.address,
    abi: config.mintContract.abi,
    functionName: 'mintNFT',
  });
  
  const { writeAsync: wrapNFT, isLoading: isWrapping } = useContractWrite({
    address: config.wrapContract.address,
    abi: config.wrapContract.abi,
    functionName: 'wrap',
  });

  const mintAndWrap = useCallback(async () => {
    try {
      if (!isConnected) {
        throw new Error("Please connect your wallet first");
      }
      
      if (chain?.id !== config.chainId) {
        throw new Error(`Please switch to the correct network (Chain ID: ${config.chainId})`);
      }
      
      // First mint the NFT
      const mintResult = await mintNFT({
        value: parseEther(config.mintContract.mintPrice)
      });
      
      // Then wrap it
      const wrapResult = await wrapNFT({
        args: [1, config.wrapContract.defaultTokenURI]
      });
      
      return {
        isLoading: isMinting || isWrapping,
        error: null,
        txHash: wrapResult.hash,
        isSuccess: !!wrapResult.hash
      };
    } catch (err) {
      return {
        isLoading: false,
        error: err?.message || "Mint and wrap failed",
        txHash: null,
        isSuccess: false
      };
    }
  }, [isConnected, chain, mintNFT, wrapNFT, isMinting, isWrapping]);

  return mintAndWrap;
};