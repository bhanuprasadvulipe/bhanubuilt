import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div style={{ 
      minHeight: '70vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <h1 style={{ fontSize: '6rem', color: 'var(--accent-primary)', marginBottom: '1rem', lineHeight: '1' }}>404</h1>
      <h2 style={{ marginBottom: '1.5rem', fontSize: '2rem' }}>Oops! Looks like you took a wrong turn.</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', maxWidth: '500px', fontSize: '1.1rem' }}>
        The page you are looking for doesn't exist or has been moved. Let's get you back to the gym.
      </p>
      <Link to="/" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
        <Home size={20} />
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
