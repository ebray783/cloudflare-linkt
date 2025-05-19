// main.js (React/Wagmi version)
import { useState, useCallback } from "react";
import { useAccount, useNetwork, useSwitchNetwork, useWalletClient, usePublicClient } from "wagmi";
import { parseEther, decodeEventLog } from "viem";

// --- Contract Config ---
export const config = {
  mintContract: {
    address: "0x1cC4a0b04f0cD580c497692451579dEC7BA02aE6",
    defaultTokenURI: "https://gateway.pinata.cloud/ipfs/bafybeiawkgrlvds34mf4yrsrvsyskd2xztzufgzlt7sk6vs5g2ejewv2ju/1.json",
    autoApprove: true,
    mintPrice: "0.01",
    abi:[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"claimant","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"feePaid","type":"uint256"}],"name":"AirdropClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"NFTTransfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"ownerAddr","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"recipients","type":"address[]"}],"name":"bulkAirdropNFT","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"buyTokens","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"claimAirdrop","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"claimFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getNFTsOwned","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"hasClaimed","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"maxNFTSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"mintNFT","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"ownerAddr","type":"address"}],"name":"nftBalanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"nftOwners","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"nftPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"ownsNFT","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"uri","type":"string"}],"name":"setBaseURI","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"newFee","type":"uint256"}],"name":"setClaimFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"newPrice","type":"uint256"}],"name":"setMintPrice","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"newRate","type":"uint256"}],"name":"setTokensPerBNB","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tokensPerBNB","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalNFTsMinted","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferNFT","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdrawBNB","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]
  },
  wrapContract: {
    address: "0x9DEe1057457666D9Ce1ed505a5f82c310A9aB3cD",
    defaultTokenURI: "https://gateway.pinata.cloud/ipfs/bafybeiawkgrlvds34mf4yrsrvsyskd2xztzufgzlt7sk6vs5g2ejewv2ju/1.json",
    abi: [
  {
    "inputs": [
      { "internalType": "address", "name": "to", "type": "address" },
      { "internalType": "uint256", "name": "tokenId", "type": "uint256" }
    ],
    "name": "approve",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "dambi",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
    "name": "getApproved",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "owner", "type": "address" },
      { "internalType": "address", "name": "operator", "type": "address" }
    ],
    "name": "isApprovedForAll",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
    "name": "isTokenWrapped",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
    "name": "unwrap",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "tokenId", "type": "uint256" },
      { "internalType": "string", "name": "tokenURI", "type": "string" }
    ],
    "name": "wrap",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
],
    
},
  chainId: 56, // BSC mainnet chain ID
  explorerUrl: "https://bscscan.com"
};

export function setupWeb3Functions() {
  // --- MINT NFT HOOK ---
  function useMintNFT() {
    const { address, isConnected } = useAccount();
    const { chain } = useNetwork();
    const { switchNetwork } = useSwitchNetwork();
    const { data: walletClient } = useWalletClient();
    const publicClient = usePublicClient();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [txHash, setTxHash] = useState(null);

    // Helper: get token URI
    const METADATA_CID = "bafybeiawkgrlvds34mf4yrsrvsyskd2xztzufgzlt7sk6vs5g2ejewv2ju";
    const getTokenURI = (tokenId) =>
      `https://gateway.pinata.cloud/ipfs/${METADATA_CID}/${tokenId}.json`;

    // Mint NFT and wrap
    const mintNFT = useCallback(
      async (nftIndex = 1) => {
        setIsLoading(true);
        setError(null);
        setTxHash(null);
        try {
          if (!isConnected) throw new Error("Wallet not connected.");
          if (chain?.id !== config.chainId) {
            if (switchNetwork) switchNetwork(config.chainId);
            throw new Error("Wrong network. Switching...");
          }
          if (!walletClient) throw new Error("Wallet client not ready.");

          // Call mintNFT on contract
          const { request } = await publicClient.simulateContract({
            address: config.mintContract.address,
            abi: config.mintContract.abi,
            functionName: "mintNFT",
            account: address,
            value: parseEther(config.mintContract.mintPrice),
          });
          const tx = await walletClient.writeContract(request);
          setTxHash(tx);

          // Wait for confirmation
          await publicClient.waitForTransactionReceipt({ hash: tx });

          // Find the tokenId from Transfer or NFTTransfer event
          const receipt = await publicClient.getTransactionReceipt({ hash: tx });
          let tokenId;
          let debugLogs = [];
          for (const log of receipt.logs) {
            debugLogs.push({ rawLog: log });
            try {
              const parsed = decodeEventLog({
                abi: config.mintContract.abi,
                data: log.data,
                topics: log.topics,
              });
              debugLogs.push({ eventName: parsed.eventName, args: parsed.args });
              if (parsed.eventName === "Transfer" || parsed.eventName === "NFTTransfer") {
                // ERC721 Transfer: topics[3] is tokenId
                // NFTTransfer: args.tokenId
                tokenId = parsed.args.tokenId || parsed.args[2] || (Array.isArray(parsed.args) && parsed.args.length > 2 ? parsed.args[2] : undefined);
                if (!tokenId && log.topics.length > 3) {
                  tokenId = BigInt(log.topics[3]);
                }
                break;
              }
            } catch (e) {
              debugLogs.push({ parseError: e.message });
            }
          }
          if (!tokenId) {
            // Custom replacer to handle BigInt serialization
            const safeStringify = (obj) => JSON.stringify(obj, (key, value) =>
              typeof value === 'bigint' ? value.toString() : value, 2
            );
            const debugMsg = "Token ID not found in events. Debug logs: " + safeStringify(debugLogs);
            console.log(debugMsg); // Log to browser console for inspection
            setError(debugMsg);
            throw new Error(debugMsg);
          }

          // Always generate the tokenURI string here for clarity
          const tokenURI = `https://gateway.pinata.cloud/ipfs/bafybeiawkgrlvds34mf4yrsrvsyskd2xztzufgzlt7sk6vs5g2ejewv2ju/${tokenId}.json`;

          // Wrap NFT
          await wrapNFT(tokenId);
          // Save last minted tokenId for auto-increment or reference
          config.lastMintedTokenId = tokenId;
        } catch (err) {
          // Always set error as string for UI
          setError(err && err.message ? err.message : String(err));
        } finally {
          setIsLoading(false);
        }
      },
      [isConnected, chain, walletClient, publicClient, address, switchNetwork]
    );

    // Wrap NFT
    const wrapNFT = useCallback(
      async (tokenId) => {
        if (!walletClient) return;
        try {
          const { request } = await publicClient.simulateContract({
            address: config.wrapContract.address,
            abi: config.wrapContract.abi,
            functionName: "wrap",
            args: [tokenId, getTokenURI(tokenId)],
            account: address,
          });
          await walletClient.writeContract(request);
        } catch (err) {
          setError(err && err.message ? err.message : String(err));
        }
      },
      [walletClient, publicClient, address]
    );

    return { mintNFT, isLoading, error, txHash };
  }

  return { useMintNFT };
}
