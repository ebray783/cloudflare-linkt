"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Import wagmi and RainbowKit
import { useAccount, useChainId, useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useSwitchNetwork } from "wagmi/actions";
import { parseEther } from "viem";

// Import local components and functions
import CustomConnectButton from './components/CustomConnectButton';
import { useMintNFT, useMintAndWrapNFT } from './main';
import AirdropClaim from './airdroptoken';

//Import UI effects
import { initNavbarScroll } from './js/navbar-scroll.js';
import { initActiveSectionDetection } from './js/active-section.js';

export const CONTRACT_ADDRESS = "0x1BEe8d11f11260A4E39627EDfCEB345aAfeb57d9";
export const BSC_TESTNET_CHAIN_ID = 97;
export const SOCIAL_LINKS = {
  twitter: "https://x.com/fpvdronetoken",
  telegram: "https://t.me/fpvdronetoken",
  github: "https://github.com/ebray783",
  facebook: "https://www.facebook.com/fpvdronetoken"
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong. Please refresh the page.</h1>;
    }
    return this.props.children;
  }
}

export const Home = () => {
  const router = useRouter();
  
  // Use wagmi hooks for wallet connection
  const { address, isConnected } = useAccount();
  
  // Use web3 hooks
  const { mintNFT, isLoading, error, txHash } = useMintNFT();
  
  // Add RainbowKit's modal hooks for better control
  const { openConnectModal } = useConnectModal();

  // Fix for hydration warning
  const [mounted, setMounted] = useState(false);
  // Track connection errors
  const [connectionError, setConnectionError] = useState(null);
  // Track if we should use QR mode
  const [useQRMode, setUseQRMode] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    
    // Check if we have a saved preference for QR mode
    const savedQRPreference = localStorage.getItem('wcUseQRCode');
    if (savedQRPreference === 'true') {
      setUseQRMode(true);
    }
    
    // Listen for WalletConnect errors
    const handleWCErrors = (event) => {
      // Check if error is related to WalletConnect
      if (event.detail?.message?.includes('wallet_connect') || 
          event.detail?.message?.includes('wc:') ||
          event.detail?.message?.includes('scheme does not have a registered handler')) {
        console.log('WalletConnect error detected:', event.detail);
        setConnectionError('Wallet app connection failed. Try using QR code instead.');
        setUseQRMode(true);
        localStorage.setItem('wcUseQRCode', 'true');
      }
    };
    
    // Create custom event listener for WalletConnect errors
    window.addEventListener('walletConnectError', handleWCErrors);
    
    // Check URL for WalletConnect errors
    if (window.location.href.includes('wc:') || 
        window.location.search.includes('error=') ||
        window.location.search.includes('failed')) {
      setConnectionError('Deep linking failed. Using QR code mode.');
      setUseQRMode(true);
      localStorage.setItem('wcUseQRCode', 'true');
    }
    
    return () => {
      window.removeEventListener('walletConnectError', handleWCErrors);
    };
  }, []);

  // Enhanced connect function with error handling
  const handleConnect = useCallback(() => {
    try {
      if (useQRMode) {
        window.localStorage.setItem('WALLETCONNECT_DEEPLINK_CHOICE', 'false');
        window.localStorage.setItem('RAINBOW_FORCE_MODAL', 'true');
      }
      openConnectModal();
    } catch (err) {
      console.error('Connection error:', err);
      setConnectionError('Failed to open wallet selector. Please try again.');
      setUseQRMode(true);
      localStorage.setItem('wcUseQRCode', 'true');
    }
  }, [useQRMode, openConnectModal]);
  
  // Reset connection errors when successfully connected
  useEffect(() => {
    if (isConnected && connectionError) {
      setConnectionError(null);
    }
  }, [isConnected, connectionError]);

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

  // Initialize UI components after mounting
  useEffect(() => {    
    if (mounted) {
      initNavbarScroll();
      initActiveSectionDetection();
      
      // Example of how to use the enhanced connect handler
      const connectButtons = document.querySelectorAll('.connect-wallet-btn');
      connectButtons.forEach(btn => {
        btn.addEventListener('click', handleConnect);
      });
      
      return () => {
        connectButtons.forEach(btn => {
          btn.removeEventListener('click', handleConnect);
        });
      };
    }
  }, [mounted]);

  // Show error message if there's a connection error
  const renderConnectionError = () => {
    if (!connectionError) return null;
    
    return (
      <div className="connection-error-notification">
        <p>{connectionError}</p>
        <button onClick={() => {
          setUseQRMode(true);
          localStorage.setItem('wcUseQRCode', 'true');
          setConnectionError(null);
          openConnectModal();
        }}>
          Try Again with QR Code
        </button>
      </div>
    );
  };
  
  // Initialize UI animations and cleanup
  useEffect(() => {
    animateCounters();
    
    // Initialize navbar scroll effect
    const cleanupScrollEffect = initNavbarScroll();
    
    // Initialize active section detection
    const cleanupActiveSection = initActiveSectionDetection();
    
    // Clean up on component unmount
    return () => {
      cleanupScrollEffect();
      cleanupActiveSection();
    };
  }, []);

  function scrollToSection(id) {
  // First remove all active classes from nav buttons
  const navButtons = document.querySelectorAll('.nav-buttons button');
  navButtons.forEach(btn => btn.classList.remove('active'));

  // Then scroll to the section
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Contract address copied to clipboard!');
  };
  
  const openBscScan = (address) => {
    window.open(`https://bscscan.com/address/${address}`, '_blank');
  };

  const LoadingState = () => (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading...</p>
    </div>
  );

  const SEO = () => (
    <Head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Security-Policy" content="default-src 'self' 'unsafe-inline' 'unsafe-eval' https: data: blob:;" />
      <title>FPVTOKEN - Cyberpunk Crypto & NFT</title>
      <meta name="description" content="FPVTOKEN is the first crypto token inspired by aliens Predator idea, including real FPV drone parts & NFT collection" />
      <meta name="keywords" content="FPV, drone, crypto, NFT, blockchain, token" />
      <meta property="og:title" content="FPVTOKEN - Cyberpunk Crypto & NFT" />
      <meta property="og:description" content="FPVTOKEN is the first crypto token inspired by aliens Predator idea" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://your-website.com" />
      <meta property="og:image" content="/gallery/logo.jpg" />
      
      {/* Fonts */}
      <link href="https://fonts.googleapis.com/css?family=Orbitron:400,700|Share+Tech+Mono|Rajdhani:500,600&display=swap" rel="stylesheet" />
      
      {/* Font Awesome for icons - Updated to latest version with specific styles */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/brands.min.css" integrity="sha512-8RxmFOVaKQe/xtg6lbscU9DU0IRhURWEuiI0tXevv+lXbAHfkpamD4VKFQRto9WgfOJDwOZ74c/t6LD3GVL51Q==" crossorigin="anonymous" referrerpolicy="no-referrer" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/fontawesome.min.css" integrity="sha512-d0olNN35C6VLiulAobxYHZiXJmq+vl+BGIgAxQtD5+kqudro/xNMvv2yIHAciGHpExsIbKX3iLg+0B6d0k4+ZA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
      
      {/* Icon fallback styles for better compatibility */}
      <style jsx>{`
        /* Fallback for immediate icon display */
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css');
        
        .fa-github::before { content: "\\f09b"; }
        .fa-twitter::before, .fa-x-twitter::before { content: "\\f099"; }
        .fa-telegram::before, .fa-telegram-plane::before { content: "\\f3fe"; }
        .fa-facebook-f::before { content: "\\f39e"; }
      `}</style>
      
      {/* Favicon */}
      <link rel="icon" type="image/png" href="/gallery/favicon.png" />
    </Head>
  );

  // Add React.memo for components that don't need frequent re-renders
  const MemoizedCustomConnectButton = React.memo(CustomConnectButton);

  // Add useMemo for expensive computations
  const tokenomicsData = useMemo(() => [
    { name: "Public Sale", value: "40%" },
    { name: "Liquidity Pool", value: "25%" },
    // ... other data
  ], []);

  const ImageWithFallback = ({ src, alt, ...props }) => {
    const [imgSrc, setImgSrc] = useState(src);
    
    return (
      <Image
        {...props}
        src={imgSrc}
        alt={alt}
        onError={() => setImgSrc('/images/fallback.jpg')}
      />
    );
  };

  const useAnalytics = () => {
    useEffect(() => {
      // Initialize analytics
      const initAnalytics = async () => {
        // Add your analytics initialization code here
      };
      initAnalytics();
    }, []);
  };

  return (
    <>
      <SEO />

      <main>
        {/* Navigation Bar */}
        <div className="topbar" id="topbar">
          <div className="search-bar">
            <i className="fas fa-search search-icon"></i>
            <input type="text" placeholder="Search..." aria-label="Search" />
          </div>
          <div className="nav-buttons">
            <button id="home-btn" onClick={() => scrollToSection('top')}>Home</button>
            <button id="about-btn" onClick={() => scrollToSection('about')}>About</button>
            <button id="claim-btn" onClick={() => scrollToSection('airdrop-section')}>Claim</button>
            <button id="contact-btn" onClick={() => scrollToSection('contact')}>Contact</button>
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
                priority={true} // Add priority for LCP optimization
                style={{objectFit: "cover"}} // Add style prop to ensure aspect ratio is maintained
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
                <button><i className="fas fa-cart-shopping"></i> Buy soon</button>
              </a>
              <a href="https://pancakeswap.finance/swap?inputCurrency=0x1BEe8d11f11260A4E39627EDfCEB345aAfeb57d9" target="_blank" rel="noopener">
                <button><i className="fas fa-right-left"></i> Sell soon</button>
              </a>
            </div>

            <Link href="./presale" className="cyberpunk-btn presale-link">
              <i className="fas fa-rocket"></i> Access Presale
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
                    <i className="fas fa-drone-alt"></i>
                    <h3>FPV Technology</h3>
                    <p>Real world hardware integration with blockchain</p>
                  </div>
                  <div className="feature-item">
                    <i className="fas fa-layer-group"></i>
                    <h3>NFT Collection</h3>
                    <p>Exclusive Predator-themed digital assets</p>
                  </div>
                  <div className="feature-item">
                    <i className="fas fa-chart-line"></i>
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
                    style={{objectFit: "cover"}} // Add style prop to ensure aspect ratio is maintained
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
                      <ImageWithFallback
                        src={`/nft/nft${num}.jpg`}
                        alt={`NFT ${num}`}
                        className="nft-image"
                        width={250}
                        height={250}
                        priority={num === 1}
                        style={{objectFit: "cover"}} // Add style prop to ensure aspect ratio is maintained
                      />
                      <div className="nft-overlay" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="wallet-container">
                <MemoizedCustomConnectButton />
              </div>
              {mounted && (
                <>
                  <button 
                    id="mainMintBtn" 
                    className="cyberpunk-btn" 
                    disabled={!isConnected || isLoading || !mintNFT} 
                    onClick={e => { e.preventDefault(); mintNFT && mintNFT(1); }}
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
              )}
              
            </div>

            {/* Token Claim Container */}
            <div className="cyberpunk-container">
              <h2 className="cyberpunk-title">Claim Token Airdrop</h2>
              <form className="cyberpunk-form" onSubmit={(e) => e.preventDefault()}>
                <label className="cyberpunk-label" htmlFor="walletInput"></label>
                <input className="cyberpunk-input" id="walletInput" placeholder="0xYourWalletAddress" />
              </form>
              
              <div style={{ marginTop: 24 }}>
                {mounted && typeof AirdropClaim === 'function' && <AirdropClaim />}
                {(!mounted || typeof AirdropClaim !== 'function') && (
                  <button className="cyberpunk-btn">
                    Claim Airdrop (Loading...)
                  </button>
                )}
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
                    <a 
                      href="https://bscscan.com/address/0x1BEe8d11f11260A4E39627EDfCEB345aAfeb57d9" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="detail-value contract-address"
                      title="View on BscScan"
                    >
                      0x1BEe8d11f11260A4E39627EDfCEB345aAfeb57d9
                    </a>
                  
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
                    style={{objectFit: "cover"}} // Add style prop to ensure aspect ratio is maintained
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
                style={{objectFit: "contain"}} // Add style prop to ensure aspect ratio is maintained
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
                  title: "RCING 2207/2750KV",
                  desc: "Super power motor used for 4s/2750kv 6s/2200kv"
                },
                {
                  img: "https://i.postimg.cc/HsSDHGmT/img1.jpg",
                  title: "SPEEDYBEE FRAME",
                  desc: "This frame gives you the best ability to control the drone"
                },
                {
                  img: "https://i.postimg.cc/59g8mJL5/luminier-props.jpg",
                  title: "Drone FPV View",
                  desc: "Capture the horizon with high-end racing drones"
                },
                {
                  img: "https://i.postimg.cc/KvQQ4L02/aifc1.jpg",
                  title: "Speedybee HD Flight Controller",
                  desc: "Best flight controller for HD and analog drones"
                },
                {
                  img: "https://i.postimg.cc/ncdYnxLV/speedybee-esc.jpg",
                  title: "Speedybee 60am ESC",
                  desc: "Speedybee 60am bethel 32 ESC"
                },
                {
                  img: "https://i.postimg.cc/tTtWwQfj/radio-fpv.jpg",
                  title: "Cyber radiomaster",
                  desc: "Next-gen FPV pilot with AR interface and goggles"
                },
                {
                  img: "https://i.postimg.cc/qM7ybFxP/img2.jpg",
                  title: "Crossfire Receiver",
                  desc: "Durable, high-gain for clear signal"
                },
                {
                  img: "https://i.postimg.cc/wBRkWrgq/wa.jpg",
                  title: "FPV Goggles HD",
                  desc: "High-definition goggles with low latency video feed"
                },
                {
                  img: "https://i.postimg.cc/kMvvhK3b/ai-air-unit.jpg",
                  title: "FPV Camera",
                  desc: "Ultra-clear wide-angle FPV camera for fast flight"
                },
                {
                  img: "https://i.postimg.cc/YChN9P46/gnb-lipo.jpg",
                  title: "LiPo Battery",
                  desc: "High-performance LiPo battery for longer flights"
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
  <div className="container">
    <h1 className="title">FPV DRONE LIST PART</h1>
    <div className="subtitle">THE COMPLETE LIST OF PART</div>
    
    <ul className="parts-grid">
      {[
        { img: "/images/frame.jpg", text: "5INCH DRONE FRAME" },
        { img: "/images/motor.jpg", text: "4X MOTOR" },
        { img: "/images/flight-controller.jpg", text: "AI FLIGHT CONTROLLER" },
        { img: "/images/esc.jpg", text: "BLHELI 32 ESC" },
        { img: "/images/air-unit.jpg", text: "AI AIR UNIT" },
        { img: "/images/receiver.jpg", text: "RX RECEIVER" },
        { img: "/images/remote.jpg", text: "REMOTE CONTROLLER" },
        { img: "/images/goggles.jpg", text: "AI FPV GOGGLES" },
        { img: "/images/propeller.jpg", text: "PROPELLERS" }
      ].map((part, index) => (
        <li className="part-box" key={index}>
          <div className="part-container">
            <div className="icon-glow">
              <img 
                src={part.img} 
                alt={part.text}
                className="part-image"
                width="64"
                height="64"
              />
            </div>
            <span className="part-text">{part.text}</span>
          </div>
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
                    "DEX Listings",
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

export default Home;
