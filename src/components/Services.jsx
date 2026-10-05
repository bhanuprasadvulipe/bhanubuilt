import React from 'react';
import { Dumbbell, Apple, Video } from 'lucide-react';
import { motion } from 'framer-motion';
import './Services.css';

const Services = () => {
  const services = [
    {
      icon: <Dumbbell size={40} />,
      title: 'Personal Training',
      description: '1-on-1 coaching tailored specifically to your body type, goals, and lifestyle for maximum results.'
    },
    {
      icon: <Apple size={40} />,
      title: 'Nutrition Plans',
      description: 'Customized meal plans that fuel your workouts and optimize your metabolism without starving.'
    },
    {
      icon: <Video size={40} />,
      title: 'Online Coaching',
      description: 'Train from anywhere in the world with my comprehensive online programs and weekly check-ins.'
    }
  ];

  return (
    <section id="services" className="services-section">
      <div className="container">
        <motion.div 
          className="section-header text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-4">How We <span>Transform You</span></h2>
          <p>Comprehensive fitness solutions designed to get you the body you've always wanted.</p>
        </motion.div>
        
        <div className="grid grid-cols-3 mt-8">
          {services.map((service, index) => (
            <motion.div 
              key={index} 
              className="card service-card"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
            >
              <div className="icon-wrapper">
                {service.icon}
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
