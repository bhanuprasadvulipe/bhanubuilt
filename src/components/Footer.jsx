import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer id="contact" className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-brand-header">
              <Link to="/" className="logo">
                Bhanu<span>Built</span>
              </Link>
              <div className="footer-brand-socials" aria-label="Social media links">
                <a 
                  href="https://www.instagram.com/bhanubuilt__?utm_source=qr&stkn=MWhpd2lxcnplY3RoOQ%3D%3D" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label="Instagram"
                  title="Instagram: @bhanubuilt__"
                  className="social-btn instagram"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </a>
                <a 
                  href="https://youtube.com/@bhanubuilt?si=MWwn8EA9SqZYzF1S" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label="YouTube"
                  title="YouTube: @bhanubuilt"
                  className="social-btn youtube"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                <a 
                  href="mailto:bhanuprasadvulipe@gmail.com" 
                  aria-label="Email"
                  title="Email: bhanuprasadvulipe@gmail.com"
                  className="social-btn email"
                >
                  <Mail size={18} />
                </a>
              </div>
            </div>
            <p className="mt-4">
              Premium personal training and online coaching for individuals who are serious about transforming their bodies and lives.
            </p>
          </div>
          
          <div className="footer-links">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="/#services">Services</a></li>
              <li><a href="/#about">About</a></li>
              <li><a href="/#transformations">Transformations</a></li>
              <li><a href="/#fitness-tools">Free Tools</a></li>
              <li><a href="/#plans">Plans</a></li>
            </ul>
          </div>
          
          <div className="footer-contact">
            <h3>Contact Us</h3>
            <ul>
              <li>
                <Phone size={18} className="contact-icon" />
                <span>+91 63049 22209</span>
              </li>
              <li>
                <Mail size={18} className="contact-icon" />
                <span>bhanuprasadvulipe@gmail.com</span>
              </li>
              <li>
                <MapPin size={18} className="contact-icon" />
                <span>Telangana, India</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} BhanuBuilt. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
