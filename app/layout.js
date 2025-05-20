import { Providers } from './providers';
import { Inter } from "next/font/google";

// Import global styles
import './globals.css';

// Import component-specific styles
import './css/base.css';
import './css/navbar.css';
import './css/hero.css';
import './css/about.css';
import './css/airdrop.css';
import './css/tokenomics.css';
import './css/explorer1.css';
import './css/here-we-go.css';
import './css/fpv-parts.css';
import './css/token-grid.css';
import './css/roadmap.css';
import './css/footer.css';
import './css/animations.css';
import './css/presale.css';
import './css/nft-carousel.css';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: 'FPVTOKEN - Cyberpunk Crypto & NFT',
  description: 'FPVTOKEN is the first crypto token inspired by aliens Predator idea, including real FPV drone parts & NFT collection',
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  themeColor: "#0ea5e9",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "FPV Token"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css?family=Orbitron:400,700|Share+Tech+Mono|Rajdhani:500,600&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}