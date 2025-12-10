/**
 * useResponsive Hook
 * Custom hook to handle responsive design logic
 * Detects screen size changes and returns whether the current screen is mobile
 */

import { useState, useEffect } from 'react';

/**
 * Custom hook for responsive design detection
 * @returns isMobile - boolean indicating if screen width is less than 768px
 */
const useResponsive = (): boolean => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    // Function to check if screen is mobile size
    const checkMobile = (): void => {
      setIsMobile(window.innerWidth < 768);
    };

    // Check on initial load
    checkMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};

export default useResponsive;
