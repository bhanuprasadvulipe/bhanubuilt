import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Transformations.css';

const Transformations = () => {
  const [transformations, setTransformations] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  const fallbackData = [
    {
      id: '1',
      before_image_url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800&auto=format&fit=crop',
      after_image_url: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop',
      name: 'Client 1',
      time: '12 Weeks'
    },
    {
      id: '2',
      before_image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800&auto=format&fit=crop',
      after_image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop',
      name: 'Client 2',
      time: '16 Weeks'
    },
    {
      id: '3',
      before_image_url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop',
      after_image_url: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800&auto=format&fit=crop',
      name: 'Client 3',
      time: '24 Weeks'
    }
  ];

  useEffect(() => {
    fetchTransformations();
  }, []);

  const fetchTransformations = async () => {
    try {
      const { data, error } = await supabase
        .from('transformations')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setTransformations(data);
      } else {
        setTransformations(fallbackData);
      }
    } catch (error) {
      console.error('Error fetching transformations:', error);
      setTransformations(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 350; // scroll by one card width
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="transformations" className="transformations-section">
      <div className="container" style={{ position: 'relative' }}>
        <motion.div 
          className="section-header text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-4">Exceptional <span>Results</span></h2>
          <p>Real people, real transformations. Your journey starts here.</p>
        </motion.div>
        
        {loading ? (
          <p className="text-center mt-8">Loading transformations...</p>
        ) : (
          <div className="carousel-wrapper mt-8">
            {transformations.length > 3 && (
              <button className="carousel-arrow left-arrow" onClick={() => scroll('left')}>
                <ChevronLeft size={24} />
              </button>
            )}
            
            <div className={`transformations-grid ${transformations.length > 3 ? 'scrollable' : ''}`} ref={scrollRef}>
              {transformations.map((t, index) => (
                <motion.div 
                  key={t.id} 
                  className="transformation-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="images-container">
                    <div className="image-half before">
                      <img src={t.before_image_url} alt={`${t.name} Before`} />
                      <span className="label">Before</span>
                    </div>
                    <div className="image-half after">
                      <img src={t.after_image_url} alt={`${t.name} After`} />
                      <span className="label">After</span>
                    </div>
                  </div>
                  <div className="card-content">
                    <h3>{t.name}</h3>
                    <p className="text-primary">{t.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {transformations.length > 3 && (
              <button className="carousel-arrow right-arrow" onClick={() => scroll('right')}>
                <ChevronRight size={24} />
              </button>
            )}
          </div>
        )}
        
        <motion.div 
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <a href="#plans" className="btn btn-primary">Start Your Transformation</a>
        </motion.div>
      </div>
    </section>
  );
};

export default Transformations;
