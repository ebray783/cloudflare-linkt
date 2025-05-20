"use client";

// Import React and Next.js components
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Import wagmi and RainbowKit
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { setupWeb3Functions } from './main.js';
import AirdropClaim from './airdroptoken.js';

export default function Home() {
  const router = useRouter();
  
  // Use wagmi hooks for wallet connection
  const { address, isConnected } = useAccount();
  const { useMintNFT } = setupWeb3Functions();
  const { mintNFT, isLoading, error, txHash } = useMintNFT();

  // Fix for hydration warning
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    // Counter animation effect
    const animateCounters = () => {
      const counters = document.querySelectorAll('.counter');
      const speed = 200;

      counters.forEach(counter => {
        const target = parseFloat(counter.innerText.replace(/,/g, ''));
        const count = parseFloat(counter.innerText.replace(/,/g, ''));
        
        if (count < target) {
          counter.innerText = count.toFixed(4);
          setTimeout(animateCounters, 1);
        } else {
          counter.innerText = target;
        }
      });
    };

    animateCounters();
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Contract address copied to clipboard!');
  };

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Security-Policy" content="default-src 'self' 'unsafe-inline' 'unsafe-eval' https: data: blob:;" />
        <title>FPVTOKEN - Cyberpunk Crypto & NFT</title>
        <meta name="description" content="FPVTOKEN is the first crypto token inspired by aliens Predator idea, including real FPV drone parts & NFT collection" />
      </Head>

      <main>
        {/* Navigation Bar */}
        <div className="topbar" id="topbar">
          <div className="search-bar">
            <i className="fa-solid fa-search search-icon"></i>
            <input type="text" placeholder="Search..." aria-label="Search" />
          </div>
          <div className="nav-buttons">
            <button onClick={() => scrollToSection('top')}>Home</button>
            <button onClick={() => scrollToSection('about')}>About</button>
            <button onClick={() => scrollToSection('airdrop-section')}>Claim</button>
            <button onClick={() => scrollToSection('contact')}>Contact</button>
          </div>
        </div>

        {/* Hero Section */}
        <section id="top" className="hero-section">
          {/* All original Hero Section content */}
          <div className="container">
            <div className="logo-container">
              <Image 
                id="logo" 
                src="/gallery/logo.jpg" 
                alt="FPVTOKEN Logo" 
                className="cyber-scanner" 
                width={150}
                height={150}
              />
              <div className="logo-overlay"></div>
            </div>
            <h1 className="glitch-text">FPVTOKEN</h1>
            <p className="description">
              The first crypto token inspired by aliens Predator idea,<br />
              Including real FPV drone parts & NFT collection
            </p>

            <div className="button-group">
              <a href="https://pancakeswap.finance/swap?outputCurrency=0x1BEe8d11f11260A4E39627EDfCEB345aAfeb57d9" target="_blank" rel="noopener" className="buy-button">
                <button><i className="fa-solid fa-cart-shopping"></i> Buy Now</button>
              </a>
              <a href="https://pancakeswap.finance/swap?inputCurrency=0x1BEe8d11f11260A4E39627EDfCEB345aAfeb57d9" target="_blank" rel="noopener">
                <button><i className="fa-solid fa-right-left"></i> Sell Token</button>
              </a>
            </div>

            <Link href="./presale" className="cyberpunk-btn presale-link">
              <i className="fa-solid fa-rocket"></i> Access Presale
            </Link>
            
        <div className="stats-banner" title="These statistics are placeholders and will be updated after token launch">
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

        {/* About Section */}
        <section id="about" className="about-section">
          {/* Keep all original About Section content */}
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
                  <Image 
                    src="/gallery/drone.jpg" 
                    alt="FPV Drone" 
                    className="about-image" 
                    width={400}
                    height={320}
                  />
                  <div className="frame-corner top-left"></div>
                  <div className="frame-corner top-right"></div>
                  <div className="frame-corner bottom-left"></div>
                  <div className="frame-corner bottom-right"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Airdrop Section - Mint, wallet, and working React airdrop claim button */}
        <section id="airdrop-section">
          <div className="airdrop-grid">
            {/* NFT Minting Container */}
            <div className="cyberpunk-container">
              <h2 className="cyberpunk-title">Mint NFT</h2>
              
              {/* NFT Preview Carousel */}
              <div className="nft-preview-container">
                <div className="nft-carousel">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <div key={num} className="nft-slide">
                      <Image
                        src={`/nft/nft${num}.jpg`}
                        alt={`NFT ${num}`}
                        className="nft-image"
                        width={250}
                        height={250}
                        priority={num === 1}
                      />
                      <div className="nft-overlay" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="wallet-container">
                <ConnectButton showBalance={true} />
              </div>
              {mounted ? (
                <>
                  <button 
                    id="mainMintBtn" 
                    className="cyberpunk-btn" 
                    disabled={!isConnected || isLoading} 
                    onClick={e => { e.preventDefault(); mintNFT(1); }}
                  >
                    {isLoading ? 'Processing...' : 'Mint NFT'}
                  </button>
                  {error && (
                    <div style={{ color: 'red', marginTop: 8 }}>
                      <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontSize: 12 }}>
                        {typeof error === 'object' ? JSON.stringify(error, (key, value) => typeof value === 'bigint' ? value.toString() : value, 2) : String(error)}
                      </pre>
                    </div>
                  )}
                  {txHash && (
                    <div style={{ color: 'green', marginTop: 8 }}>
                      Transaction: <a href={`https://testnet.bscscan.com/tx/${txHash}`} target="_blank" rel="noopener noreferrer">{txHash}</a>
                    </div>
                  )}
                </>
              ) : null}
              
            </div>

            {/* Token Claim Container */}
            <div className="cyberpunk-container">
              <h2 className="cyberpunk-title">Claim Token Airdrop</h2>
              <form className="cyberpunk-form" onSubmit={(e) => e.preventDefault()}>
                <label className="cyberpunk-label" htmlFor="walletInput"></label>
                <input className="cyberpunk-input" id="walletInput" placeholder="0xYourWalletAddress" />
              </form>
              
              <div style={{ marginTop: 24 }}>
                <AirdropClaim />
              </div>
              {mounted ? (
                <p id="walletAddress" className={`cyberpunk-status ${isConnected ? 'connected' : 'disconnected'}`}>
                  {isConnected ? `Connected: ${address}` : 'Not Connected'}
                </p>
              ) : (
                <p id="walletAddress" className="cyberpunk-status disconnected">Not Connected</p>
              )}
              
            </div>
          </div>
        </section>
        
        {/* Tokenomics Section */}
        <section id="tokenomics" className="tokenomics-section">
          {/* Keep all original Tokenomics content */}
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

        {/* Explorer Section */}
        <section id="explorer-section">
          {/* Keep all original Explorer Section content */}
          <h1 className="explorer-title">EXPLORE</h1>
          
          <div className="carousel-container">
            <div className="carousel-track">
              {[1, 2, 3].map((set) => (
                Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                  <Image 
                    key={`drone-${set}-${num}`}
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
              'rdq', 'emax', 
            ].map((brand) => (
              <Image 
                key={brand}
                src={`/explorer/${brand}.jpg`} 
                alt={brand.charAt(0).toUpperCase() + brand.slice(1)} 
                width={120}
                height={60}
              />
            ))}
          </div>
        </section>

        {/* Here We Go Section */}
        <section className="here-we-go-section">
          {/* Keep all original Here We Go Section content */}
          <header>
            <h1>HERE WE GO</h1>
          </header>
          <div className="main-wrapper">
            <div className="side-column">
              <img src="https://i.postimg.cc/2Skk7pdW/Chat-GPT-Image-Apr-13-2025-05-24-05-AM.png" alt="Left Image 1" style={{ height: 400, width: 250 }} />
            </div>

            <section className="gallery">
              {[
                {
                  img: "https://i.postimg.cc/FFyT5wc1/rcinpower-2207.jpg",
                  title: "Racing",
                  desc: "Rcing Motor"
                },
                {
                  img: "https://i.postimg.cc/HsSDHGmT/img1.jpg",
                  title: "Frame",
                  desc: "Drone Frame"
                },
                {
                  img: "https://i.postimg.cc/59g8mJL5/luminier-props.jpg",
                  title: "Propellers",
                  desc: "Lumenier Propellers"
                },
                {
                  img: "https://i.postimg.cc/KvQQ4L02/aifc1.jpg",
                  title: "FC",
                  desc: "flightcontroller"
                },
                {
                  img: "https://i.postimg.cc/ncdYnxLV/speedybee-esc.jpg",
                  title: "ESC",
                  desc: "Speedybee 60am bethel 32 ESC"
                },
                {
                  img: "https://i.postimg.cc/tTtWwQfj/radio-fpv.jpg",
                  title: "radioma",
                  desc: "Long Range Radio"
                },
                {
                  img: "https://i.postimg.cc/qM7ybFxP/img2.jpg",
                  title: "TBS",
                  desc: "Long Range Signal"
                },
                {
                  img: "https://i.postimg.cc/wBRkWrgq/wa.jpg",
                  title: "Goggles",
                  desc: "High-definition goggles"
                },
                {
                  img: "https://i.postimg.cc/kMvvhK3b/ai-air-unit.jpg",
                  title: "Airunit",
                  desc: "HD Module"
                },
                {
                  img: "https://i.postimg.cc/YChN9P46/gnb-lipo.jpg",
                  title: "LiPo",
                  desc: "Lipo Battery"
                }
              ].map((item, index) => (
                <div className="gallery-item" key={index}>
                  <img src={item.img} alt={item.title} />
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              ))}
            </section>

            <div className="side-column">
              <img src="https://i.postimg.cc/L8t9z9Z2/output-2.png" alt="Right Image 2" style={{ height: 400, width: 250 }} />
            </div>
          </div>
        </section>

        {/* FPV Drone List Section */}
        <section className="fpv-parts-section">
          {/* Keep all original FPV Parts Section content */}
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
                <li className="part-box" key={index}>
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

        {/* Token Grid Section */}
        <section id="token-grid" className="token-grid-section">
          {/* Keep all original Token Grid content */}
          <div className="container">
            <div className="token-grid">
              <div className="token-row top-row">
                {/* Token cells */}
              </div>
              <div className="token-video">
                <div className="video-container">
                  <video width="100%" height="100%" controls autoPlay muted loop>
                    <source src="/videos/token-chart.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
              <div className="token-row bottom-row">
                {/* Token cells */}
              </div>
            </div>
          </div>
        </section>

        {/* Roadmap Section */}
        <section id="roadmap">
          <div className="container">
            <h1>ROADMAP</h1>
            <div className="timeline">
              {[
                {
                  phase: "Phase 1",
                  title: "Project Launch",
                  items: [
                    "Website Launch",
                    "Smart Contract Deployment",
                    "Community Building",
                    "Marketing Campaign Initiation"
                  ]
                },
                {
                  phase: "Phase 2",
                  title: "Development & Growth",
                  items: [
                    "NFT Collection Launch",
                    "Exchange Listings",
                    "Partnership Announcements",
                    "FPV Drone Parts Integration"
                   ]
                },
                {
                  phase: "Phase 3",
                  title: "Expansion",
                  items: [
                    "Add NFT Traits Rarity Tool",
                    "Start Token Burn Events",
                    "Partnership with FPV Drone Brands"
                  ]
                },
                {
                  phase: "Phase 4",
                  title: "Ecosystem Development",
                  items: [
                    "FPV Marketplace Launch",
                    "Governance Token Integration",
                    "Global Community Events",
                    "Major Exchange Listings"
                  ]
                }
              ].map((phase, index) => (
                <div className="step" key={index}>
                  <h2>{phase.phase} - {phase.title}</h2>
                  <p>
                    {phase.items.map((item, itemIndex) => (
                      <span key={itemIndex}>• {item}<br /></span>
                    ))}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer Section */}
        <section className="footer-section" id="contact">
          {/* Keep all original Footer content */}
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
                  <a href="mailto:fpvtoken@fpv-token.com" aria-label="Email" className="social-icon email-link">
                    <img src="/social/gmail.svg" alt="Gmail" width="24" height="24" />
                  </a>
                  <a href="https://x.com/fpvdronetoken" target="_blank" rel="noopener" aria-label="Twitter/X" className="social-icon twitter-link">
                    <img src="/social/twitter.svg" alt="Twitter/X" width="24" height="24" />
                  </a>
                  <a href="https://t.me/fpvdronetoken" target="_blank" rel="noopener" aria-label="Telegram" className="social-icon telegram-link">
                    <img src="/social/telegram.svg" alt="Telegram" width="24" height="24" />
                  </a>
                  <a href="https://github.com/ebray783" target="_blank" rel="noopener" aria-label="GitHub" className="social-icon github-link">
                    <img src="/social/github.svg" alt="GitHub" width="24" height="24" />
                  </a>
                  <a href="https://www.facebook.com/fpvdronetoken" target="_blank" rel="noopener" aria-label="Facebook" className="social-icon facebook-link">
                    <img src="/social/facebook.svg" alt="Facebook" width="24" height="24" />
                  </a>
                </div>
              </div>
            </div> {/* end of footer-grid */}

            <div className="copyright">
              <p>&copy; {new Date().getFullYear()} FPVTOKEN. All rights reserved.</p>
            </div>
          </div> {/* end of container */}
        </section>
      </main>
    </>
  );
}

