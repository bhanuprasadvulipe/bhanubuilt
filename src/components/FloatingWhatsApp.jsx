import React from 'react';
import './FloatingWhatsApp.css';

const FloatingWhatsApp = () => {
  const phoneNumber = '916304922209';
  const message = 'Hi Bhanu Built! I am interested in personal training and would like to know more.';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a 
      href={whatsappUrl} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="floating-whatsapp"
      aria-label="Chat on WhatsApp"
    >
      <svg viewBox="0 0 32 32" width="35" height="35" fill="white">
        <path d="M16 2a14 14 0 0 0-11.83 21.46L2 30l6.7-2.12A13.9 13.9 0 0 0 16 30a14 14 0 0 0 0-28zm7.83 19.92c-.33.94-1.92 1.82-2.65 1.94-.7.12-1.6.35-4.57-1.1-3.56-1.74-5.83-5.36-6-5.61s-1.43-1.93-1.43-3.68c0-1.76.92-2.63 1.25-2.98.33-.36.72-.45.96-.45.24 0 .48 0 .69.01.21.01.5-.08.78.6.29.7.99 2.45 1.08 2.63.09.18.15.39.03.62-.12.24-.18.39-.36.6-.18.22-.38.48-.54.64-.18.18-.38.38-.17.74.22.36.98 1.6 2.09 2.59.86.77 1.8 1.15 2.16 1.34.36.18.57.15.79-.1.21-.24.91-1.06 1.15-1.43.24-.36.48-.3.8-.18.32.12 2.03.96 2.38 1.14.36.18.6.27.69.42.09.15.09.87-.24 1.81z"/>
      </svg>
    </a>
  );
};

export default FloatingWhatsApp;
