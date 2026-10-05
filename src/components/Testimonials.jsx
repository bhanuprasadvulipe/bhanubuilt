import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import './Testimonials.css';

const testimonials = [
  {
    id: 1,
    name: 'Arjun',
    image: 'https://ui-avatars.com/api/?name=Arjun&background=FBBF24&color=000&bold=true',
    text: "One of the best trainers I've worked with. Every session is well-planned, challenging, and motivating. I've become stronger and more confident thanks to their guidance.",
  },
  {
    id: 2,
    name: 'Sravani',
    image: 'https://ui-avatars.com/api/?name=Sravani&background=FBBF24&color=000&bold=true',
    text: "Professional, dedicated, and always encouraging. They pay close attention to technique, which has helped me avoid injuries and make steady progress.",
  },
  {
    id: 3,
    name: 'Aditya',
    image: 'https://ui-avatars.com/api/?name=Aditya&background=FBBF24&color=000&bold=true',
    text: "Highly recommend this trainer! They make workouts fun while keeping me focused on my fitness goals. The results have been amazing.",
  },
  {
    id: 4,
    name: 'Keerthana',
    image: 'https://ui-avatars.com/api/?name=Keerthana&background=FBBF24&color=000&bold=true',
    text: "The best investment I've made for my health. Their dedication and expertise have helped me achieve goals I never thought possible.",
  },
  {
    id: 5,
    name: 'Vamshi',
    image: 'https://ui-avatars.com/api/?name=Vamshi&background=FBBF24&color=000&bold=true',
    text: "Fantastic experience! They know exactly how to push you while making sure you feel comfortable and supported throughout your fitness journey.",
  },
  {
    id: 6,
    name: 'Nandini',
    image: 'https://ui-avatars.com/api/?name=Nandini&background=FBBF24&color=000&bold=true',
    text: "I've improved my strength, stamina, and overall fitness in just a few months. Their personalized approach really makes a difference.",
  },
  {
    id: 7,
    name: 'Karthik',
    image: 'https://ui-avatars.com/api/?name=Karthik&background=FBBF24&color=000&bold=true',
    text: "Great trainer with a positive attitude. They keep every session energetic and inspiring. I actually look forward to working out now!",
  },
  {
    id: 8,
    name: 'Harika',
    image: 'https://ui-avatars.com/api/?name=Harika&background=FBBF24&color=000&bold=true',
    text: "Very patient and supportive, especially for beginners. I felt comfortable from my very first session and have gained so much confidence.",
  },
  {
    id: 9,
    name: 'Surya',
    image: 'https://ui-avatars.com/api/?name=Surya&background=FBBF24&color=000&bold=true',
    text: "Their customized workout plans and regular progress tracking have helped me stay consistent and achieve real results.",
  },
  {
    id: 10,
    name: 'Ananya',
    image: 'https://ui-avatars.com/api/?name=Ananya&background=FBBF24&color=000&bold=true',
    text: "Exceptional trainer with deep knowledge of fitness and nutrition. Their guidance has completely transformed my workout routine.",
  }
];

const TestimonialCard = ({ testimonial }) => {
  return (
    <div className="testimonial-card">
      <div className="testimonial-stars">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={18} className="star-icon" fill="#FBBF24" color="#FBBF24" />
        ))}
      </div>
      <p className="testimonial-text">"{testimonial.text}"</p>
      <div className="testimonial-author">
        <img src={testimonial.image} alt={testimonial.name} className="author-avatar" />
        <div className="author-info">
          <h4 className="author-name">{testimonial.name}</h4>
        </div>
      </div>
    </div>
  );
};

const Testimonials = () => {
  return (
    <section className="testimonials-section">
      <motion.div 
        className="testimonials-header"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
      >
        <h2>What Our Users Say</h2>
        <p>Join thousands of satisfied users worldwide</p>
      </motion.div>

      <motion.div 
        className="testimonials-marquee-container"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="testimonials-track">
          <div className="testimonials-list">
            {testimonials.map((item) => (
              <TestimonialCard key={item.id} testimonial={item} />
            ))}
          </div>
          <div className="testimonials-list" aria-hidden="true">
            {testimonials.map((item) => (
              <TestimonialCard key={`dup-${item.id}`} testimonial={item} />
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Testimonials;
