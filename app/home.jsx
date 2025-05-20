"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useAccount, useDisconnect } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";

export default function Home() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { openConnectModal } = useConnectModal();
  const [connectedAccount, setConnectedAccount] = useState(null);

  useEffect(() => {
    if (isConnected && address) {
      setConnectedAccount(address);
    } else {
      setConnectedAccount(null);
    }
  }, [isConnected, address]);

  const handleMintNFT = (index = 1) => {
    // Add your NFT minting logic here
    console.log(`Minting NFT with index ${index}`);
  };

  const toggleImage = (e) => {
    const img = e.target;
    const current = img.src;
    const alt = img.getAttribute("data-alt");
    if (!alt) return;
    img.setAttribute("data-alt", current);
    img.src = alt;
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="app-container">
      <button onClick={() => window.location.href='presale.html'} className="cyberpunk-btn">
        Go to Presale
      </button>

      {/* Airdrop Claim Section */}
      <section id="airdrop-section">
        <div className="cyberpunk-container">
          <h2 className="cyberpunk-title">Claim Your Token Airdrop</h2>
          <form className="cyberpunk-form" onSubmit={(e) => e.preventDefault()}>
            <label className="cyberpunk-label" htmlFor="walletInput"></label>
            <input className="cyberpunk-input" id="walletInput" placeholder="0xYourWalletAddress" />
            <button id="claimAirdropBtn" type="button">Claim Airdrop</button>
          </form>
          <div id="status"></div>
          
          {isConnected ? (
            <>
              <button onClick={disconnect} className="cyberpunk-btn">Disconnect</button>
              <button onClick={() => handleMintNFT(1)} className="cyberpunk-btn">Mint NFT</button>
              <p id="walletAddress" className="cyberpunk-status connected">
                Connected: {address}
              </p>
            </>
          ) : (
            <>
              <button onClick={openConnectModal} className="cyberpunk-btn">Connect Wallet</button>
              <button className="cyberpunk-btn" disabled>Mint NFT</button>
              <p id="walletAddress" className="cyberpunk-status disconnected">Not Connected</p>
            </>
          )}
          <div id="nft-status"></div>
          <div id="wallet-address"></div>
        </div>
      </section>

      {/* Page 1: FPVTOKEN HOME */}
      <div className="topbar" id="topbar">
        <div className="search-bar">
          <input type="text" placeholder="Search..." />
        </div>
        <div className="nav-buttons">
          <button onClick={() => scrollToSection('top')}>Home</button>
          <button onClick={() => scrollToSection('gallery')}>Gallery</button>
          <button onClick={() => scrollToSection('mint-section')}>Mint</button>
          <button onClick={() => scrollToSection('contact')}>Contact</button>
        </div>
      </div>

      <div id="top"></div>
      <img id="logo" src="/gallery/logo.jpg" alt="Logo" />
      <h1>FPVTOKEN</h1>
      <p className="description">
        The first crypto token inspired by aliens Predator idea,<br />
        Including real FPV drone parts & NFT collection
      </p>

      <div className="button-group">
        <a href="https://pancakeswap.finance/swap?outputCurrency=0x1BEe8d11f11260A4E39627EDfCEB345aAfeb57d9" target="_blank" rel="noopener">
          <button>Buy</button>
        </a>
        <a href="https://pancakeswap.finance/swap?inputCurrency=0x1BEe8d11f11260A4E39627EDfCEB345aAfeb57d9" target="_blank" rel="noopener">
          <button>Sell</button>
        </a>
      </div>

      <h2 className="section-title">About the Project</h2>
      <p className="description">
        FPVTOKEN is the first crypto project merging FPV drone parts & NFTs.<br />
        Inspired by alien Predator themes, our mission is dimming at technology and FPV facing, into one dimining, ecosystem.
      </p>

      <h2 id="gallery" className="section-title">GALLERY</h2>
      <div className="gallery">
        <img src="/gallery/img1.jpg" alt="" />
        <img src="/gallery/img2.jpg" alt="" />
        <img src="/gallery/img3.jpg" alt="" />
        <img src="/gallery/img4.jpg" alt="" />
        <img src="/gallery/img5.jpg" alt="" />
        <img src="/gallery/img6.jpg" alt="" />
        <img src="/gallery/img7.jpg" alt="" />
        <img src="/gallery/img8.jpg" alt="" />
        <img src="/gallery/mint5.jpg" alt="" />
        <img src="/gallery/mint7.jpg" alt="" />
      </div>

      {/* Minting Section */}
      <div id="mint-section" className="section">
        <h2 className="section-title">SMART CONTRACT</h2>
        <p className="smart-contract">
          <a href="https://bscscan.com/address/0x1BEe8d11f11260A4E39627EDfCEB345aAfeb57d9" target="_blank" style={{ color: 'inherit', textDecoration: 'none' }} rel="noopener">
            0x1BEe8d11f11260A4E39627EDfCEB345aAfeb57d9
          </a>
        </p>
      </div>

      {/* Page 2: HERE WE GO Section */}
      <header>HERE WE GO</header>
      <div className="main-wrapper">
        <div className="side-column">
          <img src="https://i.postimg.cc/2Skk7pdW/Chat-GPT-Image-Apr-13-2025-05-24-05-AM.png" alt="Left Image 1" style={{ height: '400px', width: '250px' }} />
        </div>

        <section className="gallery">
          <div className="gallery-item">
            <img src="https://i.postimg.cc/FFyT5wc1/rcinpower-2207.jpg" alt="Motor" />
            <h3>RCING 2207/2750KV</h3>
            <p>Super power motor used for 4s/2750kv 6s/2200kv</p>
          </div>
          {/* More gallery items */}
          <div className="gallery-item">
            <img src="https://i.postimg.cc/HsSDHGmT/img1.jpg" alt="Frame" />
            <h3>SPEEDYBEE FRAME</h3>
            <p>This frame gives you the best ability to control the drone</p>
          </div>
          <div className="gallery-item">
            <img src="https://i.postimg.cc/59g8mJL5/luminier-props.jpg" alt="Drone" />
            <h3>Drone FPV View</h3>
            <p>Capture the horizon with high-end racing drones</p>
          </div>
          <div className="gallery-item">
            <img src="https://i.postimg.cc/KvQQ4L02/aifc1.jpg" alt="Flight Controller" />
            <h3>Speedybee HD Flight Controller</h3>
            <p>Best flight controller for HD and analog drones</p>
          </div>
          <div className="gallery-item">
            <img src="https://i.postimg.cc/ncdYnxLV/speedybee-esc.jpg" alt="ESC" />
            <h3>Speedybee 60am ESC</h3>
            <p>Speedybee 60am bethel 32 ESC</p>
          </div>
        </section>

        <div className="side-column">
          <img src="https://i.postimg.cc/L8t9z9Z2/output-2.png" alt="Right Image 2" style={{ height: '400px', width: '250px' }} />
        </div>
      </div>

      {/* FPV DRONE LIST SECTION */}
      <section className="fpv-parts-section" style={{ marginTop: '100px' }}>
        <div className="container">
          <div className="title">FPV DRONE LIST PART</div>
          <div className="subtitle">THE COMPLETE LIST OF PART</div>
          <ul>
            <li>5INCH DRONE FRAME</li>
            <li>4X MOTOR</li>
            <li>AI FLIGHT CONTROLLER</li>
            <li>BLHELI 32 ESC</li>
            <li>AI AIR UNIT</li>
            <li>RX RECEIVER</li>
            <li>REMOTE CONTROLLER</li>
            <li>AI FPV GOGGLES</li>
            <li>PROPELLERS</li>
          </ul>
          <div className="highlight">
            <a href="#">COMPLETE ALL DRONE PARTS AND EARN UP TO 100000 FPV TOKEN</a>
          </div>
        </div>
      </section>

      {/* EXPLORE SECTION */}
      <section className="explore-section" style={{ marginTop: '100px' }}>
        <h1 className="explore-title">EXPLORE</h1>
        <div className="carousel-container">
          <div className="carousel-track">
            {/* These should be converted to Next.js Image components in production */}
            <img src="/explorer/drone1.png" alt="Drone 1" />
            <img src="/explorer/drone2.png" alt="Drone 2" />
            <img src="/explorer/drone3.png" alt="Drone 3" />
            <img src="/explorer/drone4.png" alt="Drone 4" />
            <img src="/explorer/drone5.png" alt="Drone 5" />
            {/* Duplicate set for loop effect */}
            <img src="/explorer/drone1.png" alt="Drone 1 duplicate" />
            <img src="/explorer/drone2.png" alt="Drone 2 duplicate" />
          </div>
        </div>

        <h2 className="brand-title">FEATURE BRANDS</h2>
        <div className="brands">
          <img src="/explorer/walksnail.jpg" alt="Walksnail" />
          <img src="/explorer/lumenier.jpg" alt="Lumenier" />
          <img src="/explorer/iflight.jpg" alt="iFlight" />
          <img src="/explorer/radiomaster.jpg" alt="RadioMaster" />
        </div>
      </section>

      {/* NFT MINTING SECTION */}
      <section id="mint" style={{ marginTop: '100px', marginBottom: '100px' }}>
        <h2 className="section-title">NFT MINTING SECTION</h2>
        <div className="mint-section-columns">
          {/* First Row (1–24) */}
          <div className="mint-scroll-col">
            {/* Sample items, you'd probably want to map through an array for all items */}
            <div className="mint-item">
              <img 
                src="/mint/mint1.jpg" 
                data-alt="/mint/mint10b.jpg" 
                onClick={(e) => toggleImage(e)}
              />
              <br />
              <button disabled={!isConnected} onClick={() => handleMintNFT(1)}>Mint</button>
            </div>
            <div className="mint-item">
              <img 
                src="/mint/mint2.jpg" 
                data-alt="/mint/mint12b.jpg" 
                onClick={(e) => toggleImage(e)}
              />
              <br />
              <button disabled={!isConnected} onClick={() => handleMintNFT(2)}>Mint</button>
            </div>
            {/* Add more mint items here */}
          </div>
        </div>
      </section>

      {/* Cyberpunk Tokenomics Section */}
      <section className="cyber-tokenomics">
        <h2>FPV TOKEN DISTRIBUTION</h2>
        <p className="desc">Built on BSC — powering NFTs, rewards, listings, and more.</p>

        <div className="token-grid">
          {/* Top Row */}
          <div className="token-box neon-orange">10%<br /><span>Community</span><br />Airdrops</div>
          <div className="token-box neon-blue">10%<br /><span>Team</span><br />Developers</div>
          <div className="token-box neon-purple">10%<br /><span>Liquidity</span><br />DEX/CEX</div>
          <div className="token-box neon-green">10%<br /><span>NFT Holders</span><br />Rewards</div>

          {/* Video Chart in Center */}
          <div className="token-video">
            <video className="token-chart-video" controls>
              <source src="/videos/token-chart.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Bottom Row */}
          <div className="token-box neon-blue">Drone Store<br /><span>Physical Parts</span></div>
          <div className="token-box neon-purple">NFTs<br /><span>Digital Assets</span></div>
          <div className="token-box neon-orange">Exchange<br /><span>Listings</span></div>
          <div className="token-box neon-pink">50%<br /><span>Locked</span><br />5 Years</div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section id="roadmap">
        <h1>FPVTOKEN - 6 Step Roadmap</h1>
        <div className="timeline">
          <div className="step">
            <h2>Q2 2025</h2>
            <p>FPV Token and Building Ecosystem</p>
          </div>
          <div className="step">
            <h2>Q3 2025</h2>
            <p>Listing on DEX Platforms</p>
          </div>
          {/* More steps */}
        </div>
      </section>

      {/* Who We Are Section */}
      <section id="who-we-are">
        <div className="container">
          <h1>Who We Are</h1>
          <p>
            We are FPVTOKEN — a fusion of futuristic drone racing and decentralized blockchain technology.
            Born from the underground circuits of cyberpunk cities, we connect real-world FPV drone hardware
            with an exclusive NFT ecosystem.
          </p>

          <div className="team-section">
            <h2>Meet the Team</h2>
            <div className="founder">
              <img src="/whoweare/who2.png" alt="who2" />
              <h4>NeoPilot</h4>
              <p>Founder & Lead Dev</p>
            </div>
            {/* More team members */}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <div id="contact" className="contact-section">
        <h1>Contact Us</h1>
        <div className="contact-container">
          <div className="contact-item">
            <label>Country</label>
            <p>Neo Tokyo</p>
          </div>
          <div className="contact-item">
            <label>Address</label>
            <p>Cyber Street 2077, Sector 9</p>
          </div>
          {/* More contact items */}
          <div className="contact-item">
            <label>COMPANY EMAIL</label>
            <p>ebray783@fpv-token.com</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer>
        <div className="contact-links">
          <a href="https://t.me/+-7upCv9T2MtiZjNk">🔹 Telegram</a>
          <a href="https://x.com/fpvdronetoken?t=Lps3CdRYL7Udm47BBfX_fg&s=09" target="_blank" rel="noopener">🔹 Twitter</a>
          <a href="https://wa.me/your_number" target="_blank" rel="noopener">🔹 WhatsApp</a>
          <a href="mailto:ebray783@gmail.com">🔹 Email</a>
        </div>
      </footer>
    </div>
  );
}
