// Navbar scroll effect
const handleScroll = () => {
  const topbar = document.getElementById('topbar');
  if (!topbar) return;
  
  if (window.scrollY > 50) {
    topbar.classList.add('scrolled');
  } else {
    topbar.classList.remove('scrolled');
  }
};

// Initialize scroll event listener
export const initNavbarScroll = () => {
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();
    
    // Clean up event listener on unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }
  return () => {};
};
