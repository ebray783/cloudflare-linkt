if (typeof ethers === "undefined") {
  alert("Ethers.js is not loaded. Please ensure the library is included in your HTML file.");
} else {
  // 1. Define airdropConfig FIRST!
  const airdropConfig = {
    tokenContract: {
      address: "0x4419869F1A75C65C8e9Ef503A6fB6E5e36Ae990B",
      abi: null // will be loaded from file
    }
  };

  // Utility function to update the status on the UI
  function updateStatus(message, type = "info") {
    const statusEl = document.getElementById("status");
    if (statusEl) {
      statusEl.textContent = message;
      statusEl.className = type;
    }
  }

  async function loadAbis() {
    const [airdropAbi] = await Promise.all([
      fetch('../airdrop-token-abi.json').then(res => res.json())
    ]);
    airdropConfig.tokenContract.abi = airdropAbi;
  }

  // Initialize after loading ABI
  document.addEventListener("DOMContentLoaded", async () => {
    await loadAbis();

    const claimAirdropBtn = document.getElementById("claimAirdropBtn");
    if (claimAirdropBtn) {
      claimAirdropBtn.onclick = claimAirdrop;
    }
  });

  // Claim Airdrop Function
  async function claimAirdrop() {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        airdropConfig.tokenContract.address,
        airdropConfig.tokenContract.abi,
        signer
      );
      const recipientAddress = await signer.getAddress();

      // Check if already claimed
      updateStatus("⏳ Checking claim status...");
      const hasAlreadyClaimed = await contract.hasClaimed(recipientAddress);
      if (hasAlreadyClaimed) {
        updateStatus("❌ You have already claimed your airdrop.", "error");
        return;
      }

      // Check if user owns NFT
      const ownsNFT = await contract.ownsNFT(recipientAddress);

      // Set fee if needed
      let tx;
      if (!ownsNFT) {
        const claimFee = await contract.claimFee();
        tx = await contract.claimAirdrop(ethers.parseEther("500"), { value: claimFee });
      } else {
        tx = await contract.claimAirdrop(ethers.parseEther("500"));
      }

      updateStatus("⏳ Waiting for confirmation...");
      await tx.wait();
      updateStatus("✅ Airdrop successfully claimed!", "success");
    } catch (err) {
      console.error("Error:", err);
      updateStatus(`❌ ${err.message || "Something went wrong"}`, "error");
    }
  }
} // closes else 