import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ArrowLeft } from 'lucide-react';
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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Support escape key to close menu
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  return (
    <>
      {/* Mobile Backdrop Overlay - Click outside to go back */}
      <div 
        className={`mobile-backdrop ${mobileMenuOpen ? 'open' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container header-content">
          <Link to="/" className="logo" onClick={() => setMobileMenuOpen(false)}>
            Bhanu<span>Built</span>
          </Link>
          
          <nav className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
            {/* Mobile Drawer Header with Back and Close options */}
            <div className="mobile-drawer-header">
              <button 
                type="button" 
                className="mobile-back-btn" 
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Go back"
              >
                <ArrowLeft size={18} />
                <span>Back</span>
              </button>
              <button 
                type="button" 
                className="mobile-drawer-close" 
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            <div className="nav-links-inner">
              <a href="/#services" onClick={() => setMobileMenuOpen(false)}>Services</a>
              <a href="/#about" onClick={() => setMobileMenuOpen(false)}>About</a>
              <a href="/#transformations" onClick={() => setMobileMenuOpen(false)}>Transformations</a>
              <a href="/#fitness-tools" onClick={() => setMobileMenuOpen(false)}>Free Tools</a>
              <a href="/#plans" onClick={() => setMobileMenuOpen(false)}>Plans</a>
              <Link to="/admin" className="admin-link" onClick={() => setMobileMenuOpen(false)}>Admin</Link>
              <a href="/#contact" className="btn btn-primary" onClick={() => setMobileMenuOpen(false)}>Start Now</a>
            </div>
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
    </>
  );
};

export default Header;
