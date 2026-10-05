import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { ArrowRight, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import './Hero.css';

const Hero = () => {
  const [heroImage, setHeroImage] = useState('https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1000&auto=format&fit=crop');

  useEffect(() => {
    const fetchHeroImage = async () => {
      try {
        const { data } = await supabase.from('settings').select('value').eq('key', 'hero_image').single();
        if (data && data.value) {
          setHeroImage(data.value);
        }
      } catch (e) {
        // Silently fail to fallback image
      }
    };
    fetchHeroImage();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <section className="hero">
      <motion.div 
        className="hero-image"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
      >
        <div className="image-placeholder">
          <div className="glow"></div>
          <img src={heroImage} alt="Gym Trainer Bhanu" />
        </div>
      </motion.div>
      <div className="container hero-container">
        <motion.div 
          className="hero-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="badge" variants={itemVariants}>Online Personal Training</motion.div>
          <motion.h1 variants={itemVariants}>Redesign the way <span>You Look</span></motion.h1>
          <motion.p variants={itemVariants}>
            Transform your body with custom training and nutrition plans by Bhanu. Expert coaching based in Hyderabad to help you build your dream physique.
          </motion.p>
          <motion.div className="hero-actions" variants={itemVariants}>
            <a href="#plans" className="btn btn-primary">
              Start Your Journey <ArrowRight size={20} />
            </a>
            <a href="#transformations" className="btn btn-outline">
              <Play size={20} /> View Results
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
