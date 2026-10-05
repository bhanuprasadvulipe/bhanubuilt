import React from 'react';
import { ArrowRight, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import heroImg from '../assets/hero.png';
import './Hero.css';

const Hero = () => {

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } }
  };

  return (
    <section className="hero">
      <motion.div 
        className="hero-image"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="image-placeholder">
          <div className="glow"></div>
          <img src={heroImg} alt="Gym Trainer Bhanu" fetchpriority="high" />
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
