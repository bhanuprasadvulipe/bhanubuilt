import React from 'react';
import { motion } from 'framer-motion';
import './Stats.css';

const Stats = () => {
  const stats = [
    { value: '7+', label: 'Years Experience' },
    { value: '200+', label: 'Happy Clients' },
    { value: '100%', label: 'Commitment' },
    { value: '24/7', label: 'Support' }
  ];

  return (
    <section className="stats-section">
      <div className="container">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <motion.div 
              key={index} 
              className="stat-item"
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: index * 0.1, type: "spring", stiffness: 100 }}
            >
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
