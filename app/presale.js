"use client";
import { useState, useEffect } from "react";
import { useAccount, useNetwork, useSwitchNetwork, useContractWrite, usePrepareContractWrite, useContractRead, useWaitForTransaction } from "wagmi";
import { parseEther } from "viem";

const BNB_USDT_RATE = 600;

const presaleConfig = {
  carbon: {
    address: "0xC64333064AF103077264b920019eE8af089Cf4c3",
    abi: [{"inputs":[],"name":"buyTokens","outputs":[],"stateMutability":"payable","type":"function"}] // Simplified ABI for buyTokens
  },
  solar: {
    address: "0x0806A9A165D15f28Ef84a2F7604AcCa6ABF8f077",
    abi: [{"inputs":[],"name":"buyTokens","outputs":[],"stateMutability":"payable","type":"function"}]
  },
  fpv: {
    address: "0x45505bef4D66651564fa5690178733c3Abb070E4",
    abi: [{"inputs":[],"name":"buyTokens","outputs":[],"stateMutability":"payable","type":"function"}]
  }
};

const manualPrices = {
  carbon: "0.01",   // 0.01 USDT per Carbon token
  solar: "0.01",    // 0.01 USDT per Solar Wind token
  fpv: "0.001"      // 0.001 USDT per FPV token
};

function usdtToBnb(usdtAmount) {
  return (parseFloat(usdtAmount) / BNB_USDT_RATE).toString();
}

export default function Presale() {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const [status, setStatus] = useState("");
  const [tokenAmount, setTokenAmount] = useState("");
  const [selectedToken, setSelectedToken] = useState("carbon");
  const [mounted, setMounted] = useState(false);

  // Only render after client mount to avoid hydration mismatch
  useEffect(() => setMounted(true), []);

  // Calculate BNB value based on token amount and price
  const bnbValue = tokenAmount ? 
    parseEther(usdtToBnb((parseFloat(tokenAmount) * parseFloat(manualPrices[selectedToken])).toString())) 
    : parseEther("0");

  // Prepare buyTokens transaction
  const { config, error: prepareError, isError: isPrepareError } = usePrepareContractWrite({
    address: presaleConfig[selectedToken].address,
    abi: presaleConfig[selectedToken].abi,
    functionName: "buyTokens",
    value: bnbValue,
    enabled: isConnected && parseFloat(tokenAmount) > 0,
  });

  const { write, isLoading: isTxLoading, error: writeError, isError: isWriteError, data: txData } = useContractWrite({
    ...config,
    onError: (err) => {
      setStatus(`❌ ${err.message || "Something went wrong"}`);
    },
  });

  // Wait for transaction confirmation
  const { isLoading: isConfirming } = useWaitForTransaction({
    hash: txData?.hash,
    onSuccess: () => {
      setStatus("✅ Purchase successful!");
      setTokenAmount("");
    },
    onError: (error) => {
      setStatus(`❌ Transaction failed: ${error.message}`);
    },
  });

  const handleBuy = async () => {
    if (!isConnected) {
      setStatus("❌ Please connect your wallet.");
      return;
    }
    if (chain?.id !== 97 && switchNetwork) {
      switchNetwork(97);
      setStatus("❌ Please switch to BSC Testnet.");
      return;
    }
    if (!parseFloat(tokenAmount)) {
      setStatus("❌ Please enter a valid amount.");
      return;
    }
    setStatus("⏳ Processing purchase...");
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
      <div style={{ marginBottom: 16 }}>
        <select 
          value={selectedToken} 
          onChange={(e) => setSelectedToken(e.target.value)}
          style={{ marginRight: 8 }}
        >
          <option value="carbon">Carbon Token</option>
          <option value="solar">Solar Wind Token</option>
          <option value="fpv">FPV Token</option>
        </select>
        <input
          type="number"
          value={tokenAmount}
          onChange={(e) => setTokenAmount(e.target.value)}
          placeholder="Amount of tokens"
          style={{ marginRight: 8 }}
        />
        <div style={{ marginTop: 8 }}>
          Price: {manualPrices[selectedToken]} USDT per token
        </div>
        <div style={{ marginTop: 4 }}>
          Total: {tokenAmount ? (parseFloat(tokenAmount) * parseFloat(manualPrices[selectedToken])).toFixed(6) : "0"} USDT 
          ({tokenAmount ? usdtToBnb((parseFloat(tokenAmount) * parseFloat(manualPrices[selectedToken])).toString()) : "0"} BNB)
        </div>
      </div>

      <button
        type="button"
        onClick={handleBuy}
        disabled={!write || isTxLoading || isConfirming}
        style={{ marginTop: 16, cursor: (!write || isTxLoading || isConfirming) ? 'not-allowed' : 'pointer' }}
      >
        {isTxLoading || isConfirming ? "Processing..." : "Buy Tokens"}
      </button>

      {status && <div style={{ marginTop: 8 }}>{status}</div>}
      {isPrepareError && (
        <div style={{ color: 'red', marginTop: 8 }}>
          Prepare Error: {prepareError?.message}
        </div>
      )}
      {isWriteError && (
        <div style={{ color: 'red', marginTop: 8 }}>
          Write Error: {writeError?.message}
        </div>
      )}
    </div>
  );
}