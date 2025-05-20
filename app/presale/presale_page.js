"use client";
import { useState, useEffect } from "react";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import { setupPresaleFunctions, presaleConfig } from "./presale";

export default function PresalePage() {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const [status, setStatus] = useState("");
  const [mounted, setMounted] = useState(false);
  
  // Form state
  const [carbonAmount, setCarbonAmount] = useState("");
  const [solarAmount, setSolarAmount] = useState("");
  const [fpvAmount, setFpvAmount] = useState("");
  
  // Get custom hooks from presale.js
  const { useBuyTokens } = setupPresaleFunctions();
  const { buyTokens, isLoading, error, txHash } = useBuyTokens();

  // Token prices from presale.js
  const tokenPrices = {
    carbon: "0.01",   // 0.01 USDT per Carbon token
    solar: "0.01",    // 0.01 USDT per Solar Wind token
    fpv: "0.001"      // 0.001 USDT per FPV token
  };

  // Only render after client mount to avoid hydration mismatch
  useEffect(() => setMounted(true), []);

  // Handle buy token action
  const handleBuyToken = async (tokenType, amount) => {
    if (!isConnected) {
      setStatus("❌ Please connect your wallet.");
      return;
    }
    
    if (chain?.id !== presaleConfig.chainId && switchNetwork) {
      switchNetwork(presaleConfig.chainId);
      setStatus("❌ Please switch to BSC Testnet.");
      return;
    }
    
    if (!parseFloat(amount)) {
      setStatus("❌ Please enter a valid amount.");
      return;
    }
    
    setStatus(`⏳ Processing ${tokenType} token purchase...`);
    
    try {
      const tx = await buyTokens(tokenType, amount);
      setStatus(`✅ Successfully purchased ${amount} ${tokenType.toUpperCase()} tokens!`);
      
      // Reset the specific input field
      if (tokenType === 'carbon') setCarbonAmount("");
      else if (tokenType === 'solar') setSolarAmount("");
      else if (tokenType === 'fpv') setFpvAmount("");
      
    } catch (err) {
      setStatus(`❌ ${err.message || "Transaction failed"}`);
    }
  };

  // Handle transaction updates
  useEffect(() => {
    if (txHash) {
      setStatus(`⏳ Transaction submitted: ${txHash}`);
    }
  }, [txHash]);

  // Handle errors
  useEffect(() => {
    if (error) {
      setStatus(`❌ Error: ${error}`);
    }
  }, [error]);

  if (!mounted) return null;

  return (
    <div className="presale-container">
      <h2>Carbon Token Presale</h2>
      <p>Price: <span>{tokenPrices.carbon} USDT</span></p>
      <input 
        type="number" 
        value={carbonAmount}
        onChange={(e) => setCarbonAmount(e.target.value)}
        placeholder="Amount to buy" 
      />
      <button 
        onClick={() => handleBuyToken('carbon', carbonAmount)}
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Buy Carbon"}
      </button>

      <h2>Solar Wind Token Presale</h2>
      <p>Price: <span>{tokenPrices.solar} USDT</span></p>
      <input 
        type="number" 
        value={solarAmount}
        onChange={(e) => setSolarAmount(e.target.value)}
        placeholder="Amount to buy" 
      />
      <button 
        onClick={() => handleBuyToken('solar', solarAmount)}
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Buy Solar Wind"}
      </button>

      <h2>FPV Token Presale</h2>
      <p>Price: <span>{tokenPrices.fpv} USDT</span></p>
      <input 
        type="number" 
        value={fpvAmount}
        onChange={(e) => setFpvAmount(e.target.value)}
        placeholder="Amount to buy" 
      />
      <button 
        onClick={() => handleBuyToken('fpv', fpvAmount)}
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Buy FPV"}
      </button>

      {status && <div className="presale-status">{status}</div>}
    </div>
  );
}