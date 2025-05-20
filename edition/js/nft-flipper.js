// NFT Image Flipper
const nftImages = [
   
    'gallery/mint.jpg',
    'gallery/nft1.jpg',
    'gallery/nft2.jpg',
    'gallery/nft3.jpg',
    'gallery/nft4.jpg',
    'gallery/nft5.jpg',
];

class NFTFlipper {
    constructor() {
        this.currentIndex = 0;
        this.autoFlipInterval = null;
        this.nftCard = document.querySelector('.nft-card');
        this.nftImage = document.querySelector('.nft-image');
        this.setupNavDots();
        this.setupEventListeners();
        this.startAutoFlip();
    }

    setupNavDots() {
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'nft-nav-dots';
        
        nftImages.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = 'nav-dot' + (index === 0 ? ' active' : '');
            dot.addEventListener('click', () => this.flipToImage(index));
            dotsContainer.appendChild(dot);
        });
        
        this.nftCard.parentElement.appendChild(dotsContainer);
        this.dots = dotsContainer.querySelectorAll('.nav-dot');
    }

    setupEventListeners() {
        // Click to manually flip
        this.nftCard.addEventListener('click', () => {
            this.flipToNextImage();
            this.resetAutoFlip();
        });

        // Pause auto-flip on hover
        this.nftCard.addEventListener('mouseenter', () => {
            this.stopAutoFlip();
        });

        // Resume auto-flip when mouse leaves
        this.nftCard.addEventListener('mouseleave', () => {
            this.startAutoFlip();
        });
    }

    updateDots() {
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }

    flipToImage(index) {
        if (index === this.currentIndex) return;
        
        this.nftImage.classList.add('fade-out');
        
        setTimeout(() => {
            this.nftImage.src = nftImages[index];
            this.currentIndex = index;
            this.updateDots();
            this.nftImage.classList.remove('fade-out');
            this.nftImage.classList.add('fade-in');
            
            setTimeout(() => {
                this.nftImage.classList.remove('fade-in');
            }, 500);
        }, 500);
    }

    flipToNextImage() {
        const nextIndex = (this.currentIndex + 1) % nftImages.length;
        this.flipToImage(nextIndex);
    }

    startAutoFlip() {
        if (!this.autoFlipInterval) {
            this.autoFlipInterval = setInterval(() => {
                this.flipToNextImage();
            }, 5000); // Change image every 5 seconds
        }
    }

    stopAutoFlip() {
        if (this.autoFlipInterval) {
            clearInterval(this.autoFlipInterval);
            this.autoFlipInterval = null;
        }
    }

    resetAutoFlip() {
        this.stopAutoFlip();
        this.startAutoFlip();
    }
}

// Initialize the NFT Flipper when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new NFTFlipper();
}); 