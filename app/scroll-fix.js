/**
 * Scroll Fix - Prevents infinite scrolling beyond the footer
 * Version: 1.0
 */

// Function to initialize scroll fixing
function initScrollFix() {
  // Get relevant elements
  const footer = document.querySelector('.footer-section');
  const copyright = document.querySelector('.copyright');
  
  if (!footer || !copyright) {
    console.warn('Footer or copyright element not found. Scroll fix cannot be applied.');
    return;
  }
  
  // Calculate the total height of the document
  function updateDocumentHeight() {
    // Get the position of the copyright section (the very end of the content)
    const copyrightRect = copyright.getBoundingClientRect();
    const documentBottom = copyrightRect.bottom + window.scrollY;
    
    // Set a hard limit for scrolling
    document.documentElement.style.height = `${documentBottom}px`;
    document.body.style.height = `${documentBottom}px`;
    
    // Add a visual boundary at the bottom of the page
    if (!document.getElementById('scroll-boundary')) {
      const boundary = document.createElement('div');
      boundary.id = 'scroll-boundary';
      boundary.style.position = 'absolute';
      boundary.style.bottom = '0';
      boundary.style.left = '0';
      boundary.style.width = '100%';
      boundary.style.height = '1px';
      boundary.style.background = 'transparent';
      boundary.style.zIndex = '1000';
      document.body.appendChild(boundary);
    }
  }
  
  // Scroll event handler to prevent scrolling beyond the footer
  function handleScroll() {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight
    );
    
    // If we're trying to scroll beyond the document
    if (scrollY + windowHeight >= documentHeight) {
      // Lock scrolling at the bottom of the document
      window.scrollTo({
        top: documentHeight - windowHeight,
        behavior: 'auto'
      });
    }
  }
  
  // Apply initial height adjustment
  updateDocumentHeight();
  
  // Update on resize
  window.addEventListener('resize', updateDocumentHeight);
  
  // Handle scroll events
  window.addEventListener('scroll', handleScroll);
  
  // Also apply on content load (for images, etc.)
  window.addEventListener('load', updateDocumentHeight);
  
  // Fix for dynamic content
  const observer = new MutationObserver(updateDocumentHeight);
  observer.observe(document.body, { 
    childList: true, 
    subtree: true 
  });
  
  console.log('Scroll fix initialized');
}

// Initialize for non-module environments
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollFix);
  } else {
    initScrollFix();
  }
}

// Export for module environments (Next.js)
export default initScrollFix;
