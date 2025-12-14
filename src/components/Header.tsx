/**
 * Header Component
 * Handles the main navigation and mobile menu for the application
 *
 * Props:
 * - activeTab: string - currently active tab ('home', 'conditions', 'quiz')
 * - setActiveTab: function - function to change the active tab
 * - isMobile: boolean - whether the screen is mobile size
 * - showMobileMenu: boolean - whether mobile menu is open
 * - setShowMobileMenu: function - function to toggle mobile menu
 */

import React, { memo, useEffect } from 'react';
import {
  Home,
  Book,
  Network,
  FlaskConical,
  Brain,
  BarChart3,
  TrendingUp,
  Stethoscope,
  Menu,
  X,
  PieChart,
  Microscope,
  Pill
} from 'lucide-react';

interface HeaderProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  isMobile?: boolean;
  showMobileMenu?: boolean;
  setShowMobileMenu?: (show: boolean) => void;
}

const Header: React.FC<HeaderProps> = memo(({
  activeTab = 'learn',
  setActiveTab = () => {},
  isMobile = false,
  showMobileMenu = false,
  setShowMobileMenu = () => {}
}) => {
  // Define navigation items (7 core tabs)
  const navItems = [
    { id: 'learn', label: 'Learn', icon: Home },
    { id: 'quiz', label: 'Quiz', icon: Brain },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'visualizations', label: 'Visualizations', icon: PieChart },
    { id: 'reference', label: 'Reference', icon: Book },
    { id: 'pathogen-explorer', label: 'Pathogens', icon: Microscope },
    { id: 'antibiotic-explorer', label: 'Antibiotics', icon: Pill }
  ];

  // Handle keyboard navigation and outside clicks
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showMobileMenu) {
        setShowMobileMenu(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (showMobileMenu && !target.closest('header')) {
        setShowMobileMenu(false);
      }
    };

    if (showMobileMenu) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMobileMenu, setShowMobileMenu]);

  return (
    <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white p-4 shadow-clinical-lg sticky top-0 z-50 border-b border-blue-700/50" role="banner">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-2 text-xl font-bold">
          <Stethoscope size={24} aria-hidden="true" />
          MedLearn
        </div>

        {/* Desktop Navigation */}
        {!isMobile && (
          <nav className="flex gap-4" role="navigation" aria-label="Main navigation">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                tabIndex={0}
                aria-current={activeTab === id ? 'page' : undefined}
                aria-label={`Navigate to ${label}`}
                className={`nav-item flex items-center gap-2 cursor-pointer ${
                  activeTab === id ? 'active bg-blue-700/40 scale-[1.02]' : ''
                }`}
                onClick={() => setActiveTab(id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveTab(id);
                  }
                }}
              >
                <Icon size={18} aria-hidden="true" />
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </nav>
        )}

        {/* Mobile Menu Button */}
        {isMobile && (
          <button
            type="button"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-2 rounded-md hover:bg-white hover:bg-opacity-10 transition-colors duration-200 touch-manipulation"
            aria-label="Toggle navigation menu"
            aria-expanded={showMobileMenu}
            aria-controls="mobile-navigation"
          >
            {showMobileMenu ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
          </button>
        )}
      </div>

      {/* Mobile Navigation Menu */}
      {isMobile && showMobileMenu && (
        <div className="mobile-menu-enter mt-4 py-4 border-t border-white/20 backdrop-blur-sm bg-blue-900/95 rounded-b-lg">
          <nav
            id="mobile-navigation"
            className="flex flex-col gap-2"
            role="navigation"
            aria-label="Mobile navigation"
          >
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                tabIndex={0}
                aria-current={activeTab === id ? 'page' : undefined}
                aria-label={`Navigate to ${label}`}
                className={`flex items-center gap-3 cursor-pointer p-4 rounded-lg transition-all duration-200 touch-manipulation ${
                  activeTab === id
                    ? 'bg-blue-700/50 scale-[1.02] shadow-clinical-sm'
                    : 'hover:bg-blue-700/30'
                }`}
                onClick={() => {
                  setActiveTab(id);
                  setShowMobileMenu(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveTab(id);
                    setShowMobileMenu(false);
                  }
                }}
              >
                <Icon size={20} aria-hidden="true" />
                <span className="font-medium text-base">{label}</span>
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
});

Header.displayName = 'Header';

export default Header;
