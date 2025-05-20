import { useState } from 'react';
import { useRouter } from 'next/router';
import { useWeb3Functions } from './web3Functions';
import Script from 'next/script';

export default function Home() {
  const [connectedAccount, setConnectedAccount] = useState(null);
  const router = useRouter();
  const { mintNFT, status, statusType } = useWeb3Functions();

  const handleMintNFT = (id = 1) => {
    mintNFT(id);
  };

  return (
    <>
      <Head>
        <title>My Dapp</title>
        <meta name="description" content="My Dapp Description" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <section id="airdrop-section">
          <div className="cyberpunk-container">
            <button 
              id="mainMintBtn" 
              className="cyberpunk-btn" 
              disabled={!connectedAccount} 
              onClick={() => handleMintNFT(1)}
            >
              Mint NFT
            </button>
            <p id="walletAddress" className={`cyberpunk-status ${connectedAccount ? 'connected' : 'disconnected'}`}>
              {connectedAccount ? `Connected: ${connectedAccount}` : 'Not Connected'}
            </p>
            <div id="nft-status" className={`cyberpunk-status ${statusType}`}>
              {status}
            </div>
            <div id="wallet-address"></div>
          </div>
        </section>
      </main>

      <Script src="https://cdn.jsdelivr.net/npm/ethers@6.10.0/dist/ethers.umd.min.js" strategy="beforeInteractive" />
    </>
  );
}