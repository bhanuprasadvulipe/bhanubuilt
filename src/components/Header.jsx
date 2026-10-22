import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import './Header.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''} ${mobileMenuOpen ? 'menu-open' : ''}`}>
      {/* Background Dimmer: Click outside to close, placed behind nav drawer */}
      {mobileMenuOpen && (
        <div 
          className="mobile-backdrop-overlay" 
          onClick={closeMenu} 
          aria-label="Close menu"
        />
      )}

      <div className="container header-content">
        <Link to="/" className="logo" onClick={closeMenu}>
          Bhanu<span>Built</span>
        </Link>

        <nav className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
          {/* Top header inside mobile drawer with title and Exit button */}
          <div className="mobile-drawer-top">
            <span className="mobile-drawer-title">Navigation</span>
            <button 
              type="button" 
              className="mobile-exit-btn" 
              onClick={closeMenu}
              aria-label="Exit menu"
            >
              <X size={18} />
              <span>Exit</span>
            </button>
          </div>

          <div className="nav-links-list">
            <a href="/#services" onClick={closeMenu}>Services</a>
            <a href="/#about" onClick={closeMenu}>About</a>
            <a href="/#transformations" onClick={closeMenu}>Transformations</a>
            <a href="/#fitness-tools" onClick={closeMenu}>Free Tools</a>
            <a href="/#plans" onClick={closeMenu}>Plans</a>
            <Link to="/admin" className="admin-link" onClick={closeMenu}>Admin</Link>
            <a href="/#contact" className="btn btn-primary" onClick={closeMenu}>Start Now</a>
          </div>

          {/* Bottom Exit Action for easy one-hand thumb access */}
          <button 
            type="button" 
            className="mobile-bottom-exit-btn" 
            onClick={closeMenu}
          >
            <X size={18} />
            <span>Exit to Main Page</span>
          </button>
        </nav>

        <div className="mobile-controls">
          <button 
            className="mobile-toggle" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open navigation menu'}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
