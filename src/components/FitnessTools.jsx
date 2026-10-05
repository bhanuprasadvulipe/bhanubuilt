import React from 'react';
import { Link } from 'react-router-dom';
import { Calculator, Utensils, Dumbbell } from 'lucide-react';
import { motion } from 'framer-motion';
import './FitnessTools.css';

const FitnessTools = () => {
  const tools = [
    {
      title: 'Calorie Calculator',
      description: 'Find your daily calorie & TDEE needs.',
      icon: <Calculator size={40} />,
      path: '/tools/calorie'
    },
    {
      title: 'Macro Calculator',
      description: 'Get your protein, carbs & fat split.',
      icon: <Utensils size={40} />,
      path: '/tools/macro'
    },
    {
      title: '1RM Calculator',
      description: 'Estimate your one-rep max strength.',
      icon: <Dumbbell size={40} />,
      path: '/tools/1rm'
    }
  ];

  return (
    <section id="fitness-tools" className="tools-section">
      <div className="container">
        <motion.div 
          className="section-header text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-4">Free Fitness <span>Tools</span></h2>
          <p>Plan your nutrition and training with our free calculators — built for Indian diets and lifestyles.</p>
        </motion.div>
        
        <div className="grid grid-cols-3 mt-8">
          {tools.map((tool, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
            >
              <Link to={tool.path} className="card tool-card" style={{ display: 'block', height: '100%' }}>
                <div className="icon-wrapper">
                  {tool.icon}
                </div>
                <h3>{tool.title}</h3>
                <p>{tool.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FitnessTools;
