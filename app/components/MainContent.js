'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Import CSS files
import '../../css/base.css';
import '../../css/navbar.css';
import '../../css/hero.css';
import '../../css/about.css';
import '../../css/airdrop.css';
import '../../css/tokenomics.css';
import '../../css/explorer.css';
import '../../css/here-we-go.css';
import '../../css/footer.css';
import '../../css/animations.css';
import '../../css/roadmap.css';
import '../../css/fpv-parts.css';
import '../../css/token-grid.css';

const MainContent = () => {
  useEffect(() => {
    // Load any required scripts
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/js/all.min.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div>
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
          <button onClick={() => scrollToSection('tokenomics')}>Tokenomics</button>
          <button onClick={() => scrollToSection('contact')}>Contact</button>
        </div>
      </div>

      {/* Hero Section */}
      <section id="top" className="hero-section">
        <div className="container">
          <div className="logo-container">
            <Image 
              id="logo" 
              src="/gallery/logo.jpg" 
              alt="FPVTOKEN Logo" 
              className="cyber-scanner"
              width={150}
              height={150}
              priority={true}
            />
            <div className="logo-overlay"></div>
          </div>
          <h1 className="glitch-text">FPVTOKEN</h1>
          <p className="description">
            The first crypto token inspired by aliens Predator idea,<br />
            Including real FPV drone parts & NFT collection
          </p>

          <div className="button-group">
            <a href="https://pancakeswap.finance/swap?outputCurrency=0x1BEe8d11f11260A4E39627EDfCEB345aAfeb57d9" target="_blank" rel="noopener noreferrer" className="buy-button">
              <button><i className="fa-solid fa-cart-shopping"></i> Buy Now</button>
            </a>
            <a href="https://pancakeswap.finance/swap?inputCurrency=0x1BEe8d11f11260A4E39627EDfCEB345aAfeb57d9" target="_blank" rel="noopener noreferrer">
              <button><i className="fa-solid fa-right-left"></i> Sell Token</button>
            </a>
          </div>

          <Link href="/presale" className="cyberpunk-btn presale-link">
            <i className="fa-solid fa-rocket"></i> Access Presale
          </Link>
          
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

      {/* About Section */}
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

      {/* Rest of the sections... */}
      {/* Copy all remaining sections from the original file */}
      
    </div>
  );
};

export default MainContent; 