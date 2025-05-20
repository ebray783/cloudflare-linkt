'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Script from 'next/script'



export default function Home() {
  const [connectedAccount, setConnectedAccount] = useState(null)

  useEffect(() => {
    // Initialize wallet connection status
    setDisconnected()

    // Load Font Awesome
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/js/all.min.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [])

  const setConnected = (address) => {
    const statusEl = document.getElementById("walletAddress")
    if (statusEl) {
      statusEl.textContent = "Connected: " + address
      statusEl.classList.remove("disconnected")
      statusEl.classList.add("connected")
    }
    const connectBtn = document.getElementById("connectWalletBtn")
    if (connectBtn) {
      connectBtn.textContent = "Connected"
      connectBtn.disabled = true
    }
    const disconnectBtn = document.getElementById("disconnectWalletBtn")
    if (disconnectBtn) {
      disconnectBtn.style.display = "inline-block"
    }
    document.querySelectorAll('.mint-item button').forEach((btn, idx) => {
      btn.disabled = false
      btn.onclick = function () {
        mintNFT(idx + 1)
      }
    })
    const mainMintBtn = document.getElementById("mainMintBtn")
    if (mainMintBtn) {
      mainMintBtn.disabled = false
      mainMintBtn.onclick = function () {
        mintNFT(1)
      }
    }
  }

  const setDisconnected = () => {
    const statusEl = document.getElementById("walletAddress")
    if (statusEl) {
      statusEl.textContent = "Not Connected"
      statusEl.classList.remove("connected")
      statusEl.classList.add("disconnected")
    }
    const connectBtn = document.getElementById("connectWalletBtn")
    if (connectBtn) {
      connectBtn.textContent = "Connect Wallet"
      connectBtn.disabled = false
    }
    const disconnectBtn = document.getElementById("disconnectWalletBtn")
    if (disconnectBtn) {
      disconnectBtn.style.display = "none"
    }
    document.querySelectorAll('.mint-item button').forEach(btn => btn.disabled = true)
    const mainMintBtn = document.getElementById("mainMintBtn")
    if (mainMintBtn) {
      mainMintBtn.disabled = true
    }
  }

  const handleConnect = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        setConnectedAccount(accounts[0])
        setConnected(accounts[0])
      } catch (err) {
        const statusEl = document.getElementById("walletAddress")
        if (statusEl) {
          statusEl.textContent = "Connection rejected"
        }
      }
    } else {
      const statusEl = document.getElementById("walletAddress")
      if (statusEl) {
        statusEl.textContent = "MetaMask not found"
      }
    }
  }

  const handleDisconnect = () => {
    setConnectedAccount(null)
    setDisconnected()
  }

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="app-container">
      <head>
        <link href="https://fonts.googleapis.com/css?family=Orbitron:400,700|Share+Tech+Mono|Rajdhani:500,600&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
      </head>

      {/* SECTION 0: NAVIGATION BAR */}
      <div className="topbar" id="topbar">
        <div className="search-bar">
          <i className="fa-solid fa-search search-icon"></i>
          <input type="text" placeholder="Search..." aria-label="Search" />
        </div>
        <div className="nav-buttons">
          <button onClick={() => scrollToSection('top')}>Home</button>
          <button onClick={() => scrollToSection('about')}>About</button>
          <button onClick={() => scrollToSection('airdrop-section')}>Claim</button>
          <button onClick={() => scrollToSection('tokenomics')}>Tokenomics</button>
          <button onClick={() => scrollToSection('contact')}>Contact</button>
        </div>
      </div>

      {/* SECTION 1: HERO */}
      <section id="top" className="hero-section">
        <div className="container">
          <div className="logo-container">
            <Image id="logo" src="/gallery/logo.jpg" alt="FPVTOKEN Logo" className="cyber-scanner" width={200} height={200} />
            <div className="logo-overlay"></div>
          </div>
          <h1 className="glitch-text">FPVTOKEN</h1>
          <p className="description">
            The first crypto token inspired by aliens Predator idea,<br />
            Including real FPV drone parts & NFT collection
          </p>

          <div className="button-group">
            <a href="https://pancakeswap.finance/swap?outputCurrency=0x1BEe8d11f11260A4E39627EDfCEB345aAfeb57d9" target="_blank" rel="noopener">
              <button><i className="fa-solid fa-cart-shopping"></i> Buy Now</button>
            </a>
            <a href="https://pancakeswap.finance/swap?inputCurrency=0x1BEe8d11f11260A4E39627EDfCEB345aAfeb57d9" target="_blank" rel="noopener">
              <button><i className="fa-solid fa-right-left"></i> Sell Token</button>
            </a>
          </div>

          <a href="presale.html" className="cyberpunk-btn presale-link">
            <i className="fa-solid fa-rocket"></i> Access Presale
          </a>
          
          <div className="stats-banner">
            <div className="stat-item">
              <span className="stat-value counter">1247</span>
              <span className="stat-label">Holders</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">$<span className="counter">0.0042</span></span>
              <span className="stat-label">Price</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">$<span className="counter">852K</span></span>
              <span className="stat-label">Market Cap</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: ABOUT */}
      <section id="about" className="about-section">
        <div className="container">
          <h2 className="section-title">About the Project</h2>
          <div className="about-grid">
            <div className="about-content">
              <p className="description">
                FPVTOKEN is the first crypto project merging FPV drone parts & NFTs.
                Inspired by alien Predator themes, our mission is aiming at technology and FPV racing 
                into one unified ecosystem.
              </p>
              <div className="features-list">
                <div className="feature-item">
                  <i className="fa-solid fa-drone"></i>
                  <h3>FPV Technology</h3>
                  <p>Real world hardware integration with blockchain</p>
                </div>
                <div className="feature-item">
                  <i className="fa-solid fa-layer-group"></i>
                  <h3>NFT Collection</h3>
                  <p>Exclusive Predator-themed digital assets</p>
                </div>
                <div className="feature-item">
                  <i className="fa-solid fa-chart-line"></i>
                  <h3>Growth Strategy</h3>
                  <p>Sustainable tokenomics with real utility</p>
                </div>
              </div>
            </div>
            <div className="about-image-container">
              <div className="cyber-frame">
                <Image src="/gallery/drone.jpg" alt="FPV Drone" className="about-image" width={400} height={320} />
                <div className="frame-corner top-left"></div>
                <div className="frame-corner top-right"></div>
                <div className="frame-corner bottom-left"></div>
                <div className="frame-corner bottom-right"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: AIRDROP */}
      <section id="airdrop-section">
        <div className="cyberpunk-container">
          <h2 className="cyberpunk-title">Claim Your Token Airdrop</h2>
          <form className="cyberpunk-form" onSubmit={(e) => e.preventDefault()}>
            <label className="cyberpunk-label" htmlFor="walletInput"></label>
            <input className="cyberpunk-input" id="walletInput" placeholder="0xYourWalletAddress" />
            <button id="claimAirdropBtn" type="button">Claim Airdrop</button>
          </form>
          <div id="status"></div>
          <button id="connectWalletBtn" className="cyberpunk-btn" onClick={handleConnect}>Connect Wallet</button>
          <button id="disconnectWalletBtn" className="cyberpunk-btn" style={{display: 'none'}} onClick={handleDisconnect}>Disconnect</button>
          <button id="mainMintBtn" className="cyberpunk-btn" disabled>Mint NFT</button>
          <p id="walletAddress" className="cyberpunk-status disconnected">Not Connected</p>
          <div id="nft-status"></div>
          <div id="wallet-address"></div>
        </div>
      </section>

      {/* SECTION 4: TOKENOMICS */}
      <section id="tokenomics" className="tokenomics-section">
        <div className="container">
          <h2 className="section-title">Tokenomics</h2>
          <div className="tokenomics-grid">
            <div className="token-chart">
              <div className="chart-placeholder">
                <div className="chart-overlay"></div>
                <div className="chart-segments">
                  <div className="segment segment-1" data-percentage="40%"></div>
                  <div className="segment segment-2" data-percentage="25%"></div>
                  <div className="segment segment-3" data-percentage="15%"></div>
                  <div className="segment segment-4" data-percentage="10%"></div>
                  <div className="segment segment-5" data-percentage="10%"></div>
                </div>
              </div>
            </div>
            <div className="token-info">
              <div className="token-allocation">
                <div className="allocation-item">
                  <div className="color-indicator ci-1"></div>
                  <div className="allocation-details">
                    <span className="allocation-name">Public Sale</span>
                    <span className="allocation-value">40%</span>
                  </div>
                </div>
                <div className="allocation-item">
                  <div className="color-indicator ci-2"></div>
                  <div className="allocation-details">
                    <span className="allocation-name">Liquidity Pool</span>
                    <span className="allocation-value">25%</span>
                  </div>
                </div>
                <div className="allocation-item">
                  <div className="color-indicator ci-3"></div>
                  <div className="allocation-details">
                    <span className="allocation-name">Development</span>
                    <span className="allocation-value">15%</span>
                  </div>
                </div>
                <div className="allocation-item">
                  <div className="color-indicator ci-4"></div>
                  <div className="allocation-details">
                    <span className="allocation-name">Marketing</span>
                    <span className="allocation-value">10%</span>
                  </div>
                </div>
                <div className="allocation-item">
                  <div className="color-indicator ci-5"></div>
                  <div className="allocation-details">
                    <span className="allocation-name">Team</span>
                    <span className="allocation-value">10%</span>
                  </div>
                </div>
              </div>
              <div className="token-details">
                <div className="detail-item">
                  <span className="detail-label">Total Supply:</span>
                  <span className="detail-value">1,000,000,000 FPVT</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Contract:</span>
                  <span className="detail-value contract-address">0x1BEe8d11f11260A4E39627EDfCEB345aAfeb57d9</span>
                  <button className="copy-btn" onClick={() => copyToClipboard('0x1BEe8d11f11260A4E39627EDfCEB345aAfeb57d9')}>
                    <i className="fa-regular fa-copy"></i>
                  </button>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Network:</span>
                  <span className="detail-value">Binance Smart Chain</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: EXPLORER */}
      <section id="explorer-section">
        <h1 className="explorer-title">EXPLORE</h1>
        <div className="carousel-container">
          <div className="carousel-track">
            {[1, 2, 3].map((set) => (
              Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                <Image 
                  key={`set-${set}-drone-${num}`}
                  src={`/explorer/drone${num}.png`}
                  alt={`Drone ${num}`}
                  className="drone-image"
                  width={200}
                  height={200}
                />
              ))
            ))}
          </div>
        </div>
        
        <h2 className="brand-title">FEATURE BRANDS</h2>
        <div className="brands">
          {[
            'walksnail', 'lumenier', 'iflight', 'radiomaster',
            'rdq', 'emax', 'gnb', 'dji'
          ].map((brand) => (
            <Image
              key={brand}
              src={`/explorer/${brand}.jpg`}
              alt={brand.charAt(0).toUpperCase() + brand.slice(1)}
              width={150}
              height={150}
            />
          ))}
        </div>
      </section>

      {/* SECTION 6: HERE WE GO */}
      <section className="here-we-go-section">
        <header>
          <h1>HERE WE GO</h1>
        </header>
        <div className="main-wrapper">
          <div className="side-column">
            <Image
              src="https://i.postimg.cc/2Skk7pdW/Chat-GPT-Image-Apr-13-2025-05-24-05-AM.png"
              alt="Left Image 1"
              width={250}
              height={400}
            />
          </div>

          <section className="gallery">
            {[
              {
                src: "https://i.postimg.cc/FFyT5wc1/rcinpower-2207.jpg",
                title: "RCING 2207/2750KV",
                desc: "Super power motor used for 4s/2750kv 6s/2200kv"
              },
              {
                src: "https://i.postimg.cc/HsSDHGmT/img1.jpg",
                title: "SPEEDYBEE FRAME",
                desc: "This frame gives you the best ability to control the drone"
              },
              {
                src: "https://i.postimg.cc/59g8mJL5/luminier-props.jpg",
                title: "Drone FPV View",
                desc: "Capture the horizon with high-end racing drones"
              },
              {
                src: "https://i.postimg.cc/KvQQ4L02/aifc1.jpg",
                title: "Speedybee HD Flight Controller",
                desc: "Best flight controller for HD and analog drones"
              },
              {
                src: "https://i.postimg.cc/ncdYnxLV/speedybee-esc.jpg",
                title: "Speedybee 60am ESC",
                desc: "Speedybee 60am bethel 32 ESC"
              },
              {
                src: "https://i.postimg.cc/tTtWwQfj/radio-fpv.jpg",
                title: "Cyber radiomaster",
                desc: "Next-gen FPV pilot with AR interface and goggles"
              },
              {
                src: "https://i.postimg.cc/qM7ybFxP/img2.jpg",
                title: "Crossfire Receiver",
                desc: "Durable, high-gain for clear signal"
              },
              {
                src: "https://i.postimg.cc/wBRkWrgq/wa.jpg",
                title: "FPV Goggles HD",
                desc: "High-definition goggles with low latency video feed"
              },
              {
                src: "https://i.postimg.cc/kMvvhK3b/ai-air-unit.jpg",
                title: "FPV Camera",
                desc: "Ultra-clear wide-angle FPV camera for fast flight"
              },
              {
                src: "https://i.postimg.cc/YChN9P46/gnb-lipo.jpg",
                title: "LiPo Battery",
                desc: "High-performance LiPo battery for longer flights"
              }
            ].map((item, index) => (
              <div key={index} className="gallery-item">
                <Image src={item.src} alt={item.title} width={200} height={200} />
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </section>

          <div className="side-column">
            <Image
              src="https://i.postimg.cc/L8t9z9Z2/output-2.png"
              alt="Right Image 2"
              width={250}
              height={400}
            />
          </div>
        </div>
      </section>

      {/* FPV DRONE LIST SECTION */}
      <section className="fpv-parts-section">
        <div className="container">
          <h1 className="title">FPV DRONE LIST PART</h1>
          <div className="subtitle">THE COMPLETE LIST OF PART</div>
          
          <ul className="parts-grid">
            {[
              { icon: "cube", text: "5INCH DRONE FRAME" },
              { icon: "cog", text: "4X MOTOR" },
              { icon: "microchip", text: "AI FLIGHT CONTROLLER" },
              { icon: "bolt", text: "BLHELI 32 ESC" },
              { icon: "broadcast-tower", text: "AI AIR UNIT" },
              { icon: "satellite-dish", text: "RX RECEIVER" },
              { icon: "gamepad", text: "REMOTE CONTROLLER" },
              { icon: "vr-cardboard", text: "AI FPV GOGGLES" },
              { icon: "fan", text: "PROPELLERS" }
            ].map((part, index) => (
              <li key={index} className="part-box">
                <div className="icon-glow">
                  <i className={`fas fa-${part.icon}`}></i>
                </div>
                <span>{part.text}</span>
              </li>
            ))}
          </ul>

          <div className="highlight">
            <div className="trophy-icon">
              <i className="fas fa-trophy"></i>
            </div>
            <a href="#" className="reward-text">
              COMPLETE ALL DRONE PARTS AND EARN UP TO
              <span className="token-amount">100000 FPV TOKEN</span>
            </a>
          </div>
        </div>
      </section>

      {/* TOKEN GRID SECTION */}
      <section id="token-grid" className="token-grid-section">
        <div className="container">
          <div className="token-grid">
            {/* Top Row */}
            <div className="token-row top-row">
              {[
                { icon: "users", title: "Community", value: "10%", color: "neon-orange" },
                { icon: "users-gear", title: "Team", value: "10%", color: "neon-blue" },
                { icon: "water", title: "Liquidity", value: "10%", color: "neon-purple" },
                { icon: "image", title: "NFT Holders", value: "10%", color: "neon-green" }
              ].map((item, index) => (
                <div key={index} className={`token-cell ${item.color}`}>
                  <i className={`fas fa-${item.icon}`}></i>
                  <h3>{item.title}</h3>
                  <p>{item.value}</p>
                </div>
              ))}
            </div>

            {/* Center Video */}
            <div className="token-video">
              <div className="video-container">
                <video width="100%" height="100%" controls autoPlay muted loop>
                  <source src="/videos/token-chart.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="token-row bottom-row">
              {[
                { icon: "store", title: "Drone Store", value: "Development", color: "neon-pink" },
                { icon: "cube", title: "NFTs", value: "Marketplace", color: "neon-purple" },
                { icon: "chart-line", title: "Exchange", value: "Listings", color: "neon-blue" },
                { icon: "lock", title: "Locked", value: "50% for 5 years", color: "neon-green" }
              ].map((item, index) => (
                <div key={index} className={`token-cell ${item.color}`}>
                  <i className={`fas fa-${item.icon}`}></i>
                  <h3>{item.title}</h3>
                  <p>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ROADMAP SECTION */}
      <section id="roadmap">
        <h1>ROADMAP</h1>
        <div className="timeline">
          {[
            {
              quarter: "Q2 2025",
              desc: "Launch of FPVTOKEN and initial NFT collection. Establishment of community channels and social media presence. Partnership with key FPV drone manufacturers."
            },
            {
              quarter: "Q3 2025",
              desc: "Release of exclusive Predator-themed NFT marketplace. Integration with major DEXs. First airdrop event for early adopters."
            },
            {
              quarter: "Q4 2025",
              desc: "Launch of FPV drone parts marketplace accepting FPVTOKEN. Implementation of staking rewards system. Community governance features."
            },
            {
              quarter: "Q1 2026",
              desc: "Introduction of cross-chain bridge functionality. Expansion of NFT utilities. Launch of mobile app for token and NFT management."
            },
            {
              quarter: "Q2 2026",
              desc: "Development of AR/VR features for NFT visualization. Partnership with major drone racing leagues. Launch of FPVTOKEN rewards program."
            },
            {
              quarter: "Q4 2026",
              desc: "Integration with metaverse platforms. Launch of virtual drone racing tournaments with NFT prizes. Enhanced marketplace features."
            },
            {
              quarter: "Q1 2027",
              desc: "Global expansion of FPV ecosystem. Launch of decentralized drone parts verification system. Advanced NFT breeding and evolution mechanics."
            }
          ].map((milestone, index) => (
            <div key={index} className="step">
              <h2>{milestone.quarter}</h2>
              <p>{milestone.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER SECTION */}
      <section className="footer-section" id="contact">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-logo">
              <h3>FPVTOKEN</h3>
              <p>Merging Predator aesthetics with crypto innovation</p>
            </div>
            <div className="footer-links">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#top">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#tokenomics">Tokenomics</a></li>
                <li><a href="#airdrop-section">Claim Airdrop</a></li>
              </ul>
            </div>
            <div className="footer-social">
              <h4>Connect With Us</h4>
              <div className="social-icons">
                <a href="https://twitter.com/fpvtoken" target="_blank" rel="noopener" aria-label="Twitter">
                  <i className="fa-brands fa-twitter"></i>
                </a>
                <a href="https://t.me/fpvtoken" target="_blank" rel="noopener" aria-label="Telegram">
                  <i className="fa-brands fa-telegram"></i>
                </a>
                <a href="https://discord.gg/fpvtoken" target="_blank" rel="noopener" aria-label="Discord">
                  <i className="fa-brands fa-discord"></i>
                </a>
                <a href="https://medium.com/@fpvtoken" target="_blank" rel="noopener" aria-label="Medium">
                  <i className="fa-brands fa-medium"></i>
                </a>
              </div>
            </div>
          </div>
          <div className="copyright">
            <p>&copy; 2023 FPVTOKEN. All rights reserved.</p>
          </div>
        </div>
      </section>

      {/* Scripts */}
      <Script src="https://cdn.jsdelivr.net/npm/ethers@6.10.0/dist/ethers.umd.min.js" />
      <Script src="/airdroptoken.js" />
      <Script src="/main.js" />
      <Script src="/mintauto.js" />
    </div>
  )
} 