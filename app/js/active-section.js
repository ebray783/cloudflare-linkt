// Active section detection logic
export const initActiveSectionDetection = () => {
  if (typeof window === 'undefined') return () => {};
  
  const handleSectionVisibility = () => {
    const sections = document.querySelectorAll('section');
    const navButtons = document.querySelectorAll('.nav-buttons button');
    
    if (!sections.length || !navButtons.length) return;
    
    let currentSectionId = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (window.scrollY >= sectionTop - 200 && 
          window.scrollY < sectionTop + sectionHeight - 200) {
        currentSectionId = section.id;
      }
    });
    
    // Clear active state from all buttons
    navButtons.forEach(button => {
      button.classList.remove('active');
    });
    
    // Activate the correct button
    if (currentSectionId) {
      const activeButton = document.getElementById(`${currentSectionId}-btn`);
      if (activeButton) {
        activeButton.classList.add('active');
      } else if (currentSectionId === 'top') {
        // Special case for top section mapped to home button
        const homeButton = document.getElementById('home-btn');
        if (homeButton) homeButton.classList.add('active');
      }
    }
  };
  
  // Set up the event listener
  window.addEventListener('scroll', handleSectionVisibility);
  
  // Initial check
  handleSectionVisibility();
  
  // Clean up function
  return () => {
    window.removeEventListener('scroll', handleSectionVisibility);
  };
};
