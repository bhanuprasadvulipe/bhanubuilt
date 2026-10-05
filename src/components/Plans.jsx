import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import toast, { Toaster } from 'react-hot-toast';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import './Plans.css';

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };
  
  const [formData, setFormData] = useState({
    customer_name: '',
    email: '',
    contact: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      if (data) setPlans(data);
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast.error('Failed to load plans.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
  };

  const closeModal = () => {
    setSelectedPlan(null);
    setFormData({ customer_name: '', email: '', contact: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('submissions')
        .insert([
          {
            customer_name: formData.customer_name,
            email: formData.email,
            contact: formData.contact,
            plan_name: selectedPlan.name
          }
        ]);
        
      if (error) throw error;
      
      toast.success('Your request has been submitted!');
      
      // WhatsApp Redirection
      // REPLACE '919999999999' WITH YOUR ACTUAL WHATSAPP NUMBER (include country code, no +)
      const phoneNumber = '916304922209'; 
      const message = `Hi, I am interested in the ${selectedPlan.name} plan.\n\nMy Details:\nName: ${formData.customer_name}\nEmail: ${formData.email}\nContact: ${formData.contact}`;
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
      
      window.open(whatsappUrl, '_blank');
      
      closeModal();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="plans" className="plans-section relative">
      <Toaster position="top-center" />
      <div className="container">
        <motion.div 
          className="section-header text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-4">Choose Your <span>Plan</span></h2>
          <p>Investment in your health yields the best returns.</p>
        </motion.div>
        
        {loading ? (
          <div className="text-center mt-8"><p>Loading plans...</p></div>
        ) : plans.length === 0 ? (
          <div className="text-center mt-8"><p>No plans available at the moment.</p></div>
        ) : (
          <div className="grid-navigation">
            <button className="nav-arrow" onClick={() => scroll('left')} aria-label="Previous plans">
              <ChevronLeft size={24} />
            </button>
            <div className={`grid grid-cols-${plans.length >= 4 ? '4' : '3'} mt-8`} ref={scrollRef}>
            {plans.map((plan, index) => (
              <motion.div 
                key={plan.id} 
                className={`card plan-card ${plan.is_popular ? 'popular' : ''}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                whileHover={{ y: plan.is_popular ? 0 : -10, transition: { duration: 0.2 } }}
              >
                {plan.is_popular && <div className="popular-badge">Most Popular</div>}
                <h3>{plan.name}</h3>
                <div className="price" style={{ margin: '2rem 0' }}>
                  <span className="amount">{plan.price}</span>
                </div>
                
                <button 
                  className={`btn ${plan.is_popular ? 'btn-primary' : 'btn-outline'} w-100`}
                  onClick={() => handleSelectPlan(plan)}
                >
                  Select Plan
                </button>
              </motion.div>
            ))}
            </div>
            <button className="nav-arrow" onClick={() => scroll('right')} aria-label="Next plans">
              <ChevronRight size={24} />
            </button>
          </div>
        )}
      </div>

      {/* Modal for Submission */}
      {selectedPlan && (
        <div className="modal-overlay">
          <div className="modal-content card">
            <button className="modal-close" onClick={closeModal}><X size={24} /></button>
            <h3 style={{ marginTop: 0 }}>Complete Your Request</h3>
            <p className="mb-4 text-sm" style={{ opacity: 0.8, marginBottom: '1.5rem' }}>
              You selected: <strong>{selectedPlan.name}</strong> ({selectedPlan.price})
            </p>
            
            <form onSubmit={handleSubmit} className="submission-form">
              <div className="form-group">
                <label>Name</label>
                <input 
                  type="text" 
                  name="customer_name" 
                  value={formData.customer_name} 
                  onChange={handleChange} 
                  required 
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Contact Number</label>
                <input 
                  type="tel" 
                  name="contact" 
                  value={formData.contact} 
                  onChange={handleChange} 
                  required 
                  className="form-input"
                />
              </div>
              <button type="submit" className="btn btn-primary w-100 mt-4" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit on WhatsApp'}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Plans;
