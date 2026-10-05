import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import toast, { Toaster } from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';
import './Admin.css';

const UpdatePassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have an active session (Supabase automatically creates one when clicking the recovery link)
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Invalid or expired reset link.');
        navigate('/admin');
      }
    };
    checkSession();
  }, [navigate]);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;
      
      toast.success('Password updated successfully!');
      // Sign out and redirect to login so they can test the new password
      await supabase.auth.signOut();
      navigate('/admin');
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <Toaster position="top-center" />
      <div className="admin-card">
        <div className="text-center mb-8">
          <h2>Update <span>Password</span></h2>
          <p className="text-secondary mt-2">Enter your new secure password</p>
        </div>
        
        <form onSubmit={handleUpdatePassword} className="admin-form">
          <div className="form-group">
            <label>New Password</label>
            <div className="password-input-wrapper" style={{ position: 'relative' }}>
              <input 
                type={showPassword ? "text" : "password"} 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
                required 
                className="form-input"
                style={{ paddingRight: '2.5rem' }}
                minLength={6}
              />
              <button 
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-100 mt-4" disabled={loading}>
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePassword;
