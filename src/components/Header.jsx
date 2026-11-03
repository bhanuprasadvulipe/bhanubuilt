import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Mail } from 'lucide-react';
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
        <div className="header-brand-group">
          <Link to="/" className="logo" onClick={closeMenu}>
            BHANU<span>BUILT</span>
          </Link>
          
          <div className="header-social-links" aria-label="Social media links">
            <a 
              href="https://www.instagram.com/bhanubuilt__?utm_source=qr&stkn=MWhpd2lxcnplY3RoOQ%3D%3D" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Instagram"
              title="Instagram: @bhanubuilt__"
              className="header-social-link instagram"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>
            <a 
              href="https://youtube.com/@bhanubuilt?si=MWwn8EA9SqZYzF1S" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="YouTube"
              title="YouTube: @bhanubuilt"
              className="header-social-link youtube"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
            <a 
              href="mailto:bhanuprasadvulipe@gmail.com" 
              aria-label="Email"
              title="Email: bhanuprasadvulipe@gmail.com"
              className="header-social-link email"
            >
              <Mail size={16} />
            </a>
          </div>
        </div>

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
