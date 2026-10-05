import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import './Header.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Theme state
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    if (isDarkTheme) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkTheme]);

  const toggleTheme = () => {
    setIsDarkTheme(prev => !prev);
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container header-content">
        <Link to="/" className="logo">
          Bhanu <span>Built</span>
        </Link>
        
        <nav className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
          <a href="/#services" onClick={() => setMobileMenuOpen(false)}>Services</a>
          <a href="/#about" onClick={() => setMobileMenuOpen(false)}>About</a>
          <a href="/#transformations" onClick={() => setMobileMenuOpen(false)}>Transformations</a>
          <a href="/#fitness-tools" onClick={() => setMobileMenuOpen(false)}>Free Tools</a>
          <a href="/#plans" onClick={() => setMobileMenuOpen(false)}>Plans</a>
          <Link to="/admin" className="admin-link" onClick={() => setMobileMenuOpen(false)}>Admin</Link>
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            {isDarkTheme ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <a href="/#contact" className="btn btn-primary" onClick={() => setMobileMenuOpen(false)}>Start Now</a>
        </nav>

        <div className="mobile-controls">
          <button className="theme-toggle mobile-theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            {isDarkTheme ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <button className="mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
