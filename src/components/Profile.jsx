import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { CheckCircle } from 'lucide-react';
import './Profile.css';

const Profile = () => {
  const [profileImage, setProfileImage] = useState('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop');

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const { data } = await supabase.from('settings').select('value').eq('key', 'profile_image').single();
        if (data && data.value) {
          setProfileImage(data.value);
        }
      } catch (e) {
        // Silently fail to fallback image
      }
    };
    fetchProfileImage();
  }, []);

  const features = [
    'Certified Fitness Professional',
    'Customized Diet Plans',
    'Scientific Training Approach',
    '24/7 Ongoing Support'
  ];

  return (
    <section id="about" className="profile-section">
      <div className="container">
        <div className="profile-grid">
          <div className="profile-image">
            <div className="image-wrapper">
              <img src={profileImage} alt="Bhanu Built Professional" />
              <div className="experience-badge">
                <span className="years">7+</span>
                <span className="text">Years<br/>Experience</span>
              </div>
            </div>
          </div>
          
          <div className="profile-content">
            <h2 className="mb-4">Meet <span>Bhanu Prasad Vulipe</span></h2>
            <p className="subtitle mb-6">Your Dedicated Fitness Coach</p>
            
            <p className="mb-4">
              With over 7 years of experience in the fitness industry, I've helped hundreds of individuals transform their bodies and their lives. My approach combines evidence-based training methods with sustainable nutrition strategies.
            </p>
            <p className="mb-6">
              I believe that fitness is not just about looking good, but feeling strong, confident, and capable in your everyday life. Whether you're a beginner or an advanced athlete, I will guide you every step of the way.
            </p>
            
            <ul className="feature-list mb-8">
              {features.map((feature, index) => (
                <li key={index}>
                  <CheckCircle size={20} className="check-icon" />
                  {feature}
                </li>
              ))}
            </ul>
            
            <a href="#contact" className="btn btn-primary">Work With Me</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
