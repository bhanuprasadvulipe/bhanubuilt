import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import toast, { Toaster } from 'react-hot-toast';
import { Edit, Trash2, Plus, LogOut, X } from 'lucide-react';
import './Admin.css';

const AdminDashboard = () => {
  const [session, setSession] = useState(null);
  const [activeTab, setActiveTab] = useState('plans'); // 'plans', 'submissions', or 'transformations'
  const [plans, setPlans] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [transformations, setTransformations] = useState([]);
  const [siteSettings, setSiteSettings] = useState({
    hero_image: '',
    profile_image: ''
  });
  const [uploadingSetting, setUploadingSetting] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Modal State for Plan
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [planForm, setPlanForm] = useState({
    name: '',
    price: '',
    is_popular: false
  });

  // Modal State for Transformation
  const [showTransModal, setShowTransModal] = useState(false);
  const [transForm, setTransForm] = useState({
    name: '',
    time: '',
    beforeImage: null,
    afterImage: null
  });
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/admin');
    } else {
      setSession(session);
      fetchData();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchPlans(), fetchSubmissions(), fetchTransformations(), fetchSettings()]);
    setLoading(false);
  };

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from('settings')
      .select('*');
    if (!error && data) {
      const settingsObj = {};
      data.forEach(item => {
        settingsObj[item.key] = item.value;
      });
      setSiteSettings(prev => ({ ...prev, ...settingsObj }));
    }
  };

  const fetchPlans = async () => {
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .order('created_at', { ascending: true });
    if (!error && data) setPlans(data);
  };

  const fetchSubmissions = async () => {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setSubmissions(data);
  };

  const fetchTransformations = async () => {
    const { data, error } = await supabase
      .from('transformations')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setTransformations(data);
  };

  const openPlanModal = (plan = null) => {
    if (plan) {
      setEditingPlan(plan);
      setPlanForm({ name: plan.name, price: plan.price, is_popular: plan.is_popular });
    } else {
      setEditingPlan(null);
      setPlanForm({ name: '', price: '', is_popular: false });
    }
    setShowPlanModal(true);
  };

  const handlePlanSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPlan) {
        const { error } = await supabase
          .from('plans')
          .update(planForm)
          .eq('id', editingPlan.id);
        if (error) throw error;
        toast.success('Plan updated successfully');
      } else {
        const { error } = await supabase
          .from('plans')
          .insert([planForm]);
        if (error) throw error;
        toast.success('Plan added successfully');
      }
      setShowPlanModal(false);
      fetchPlans();
    } catch (error) {
      toast.error('Error saving plan');
    }
  };

  const handleDeletePlan = async (id) => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      try {
        const { error } = await supabase.from('plans').delete().eq('id', id);
        if (error) throw error;
        toast.success('Plan deleted');
        fetchPlans();
      } catch (error) {
        toast.error('Error deleting plan');
      }
    }
  };

  const handleDeleteSubmission = async (id) => {
    if (window.confirm('Are you sure you want to delete this submission?')) {
      try {
        const { error } = await supabase.from('submissions').delete().eq('id', id);
        if (error) throw error;
        toast.success('Submission deleted');
        fetchSubmissions();
      } catch (error) {
        toast.error('Error deleting submission');
      }
    }
  };

  const handleTransSubmit = async (e) => {
    e.preventDefault();
    if (!transForm.beforeImage || !transForm.afterImage) {
      toast.error('Please select both before and after images');
      return;
    }
    
    setUploadingImage(true);
    try {
      // Upload Before Image
      const beforeExt = transForm.beforeImage.name.split('.').pop();
      const beforeFileName = `${Date.now()}_before.${beforeExt}`;
      const { error: beforeErr } = await supabase.storage
        .from('transformations')
        .upload(beforeFileName, transForm.beforeImage);
      if (beforeErr) throw beforeErr;

      // Upload After Image
      const afterExt = transForm.afterImage.name.split('.').pop();
      const afterFileName = `${Date.now()}_after.${afterExt}`;
      const { error: afterErr } = await supabase.storage
        .from('transformations')
        .upload(afterFileName, transForm.afterImage);
      if (afterErr) throw afterErr;

      // Get public URLs
      const beforeUrl = supabase.storage.from('transformations').getPublicUrl(beforeFileName).data.publicUrl;
      const afterUrl = supabase.storage.from('transformations').getPublicUrl(afterFileName).data.publicUrl;

      // Insert into database
      const { error: dbErr } = await supabase.from('transformations').insert([{
        name: transForm.name,
        time: transForm.time,
        before_image_url: beforeUrl,
        after_image_url: afterUrl
      }]);
      if (dbErr) throw dbErr;

      toast.success('Transformation added successfully');
      setShowTransModal(false);
      setTransForm({ name: '', time: '', beforeImage: null, afterImage: null });
      fetchTransformations();
    } catch (error) {
      console.error(error);
      toast.error('Error adding transformation');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDeleteTransformation = async (id, beforeUrl, afterUrl) => {
    if (window.confirm('Are you sure you want to delete this transformation?')) {
      try {
        // Attempt to delete images from storage
        const getPath = (url) => {
          try { return url.split('/transformations/')[1]; } catch { return null; }
        };
        const beforePath = getPath(beforeUrl);
        const afterPath = getPath(afterUrl);
        
        if (beforePath) await supabase.storage.from('transformations').remove([beforePath]);
        if (afterPath) await supabase.storage.from('transformations').remove([afterPath]);

        const { error } = await supabase.from('transformations').delete().eq('id', id);
        if (error) throw error;
        toast.success('Transformation deleted');
        fetchTransformations();
      } catch (error) {
        toast.error('Error deleting transformation');
      }
    }
  };

  const handleSettingImageUpload = async (file, keyName) => {
    if (!file) return;
    setUploadingSetting(true);
    
    try {
      const ext = file.name.split('.').pop();
      const fileName = `${Date.now()}_${keyName}.${ext}`;
      
      const { error: uploadErr } = await supabase.storage
        .from('transformations')
        .upload(fileName, file);
      if (uploadErr) throw uploadErr;

      const publicUrl = supabase.storage.from('transformations').getPublicUrl(fileName).data.publicUrl;

      const { error: dbErr } = await supabase
        .from('settings')
        .upsert([{ key: keyName, value: publicUrl }], { onConflict: 'key' });
        
      if (dbErr) throw dbErr;
      
      setSiteSettings(prev => ({ ...prev, [keyName]: publicUrl }));
      toast.success('Image updated successfully');
      
    } catch (error) {
      console.error(error);
      toast.error('Error uploading image');
    } finally {
      setUploadingSetting(false);
    }
  };

  if (!session) return null;

  return (
    <div className="admin-container" style={{ alignItems: 'flex-start' }}>
      <Toaster position="top-center" />
      <div className="admin-dashboard">
        <div className="dashboard-header">
          <h2>Admin <span>Dashboard</span></h2>
          <button className="btn btn-outline" onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <LogOut size={18} /> Logout
          </button>
        </div>

        <div className="admin-tabs">
          <button 
            className={`tab-btn ${activeTab === 'plans' ? 'active' : ''}`}
            onClick={() => setActiveTab('plans')}
          >
            Manage Plans
          </button>
          <button 
            className={`tab-btn ${activeTab === 'submissions' ? 'active' : ''}`}
            onClick={() => setActiveTab('submissions')}
          >
            Submissions
          </button>
          <button 
            className={`tab-btn ${activeTab === 'transformations' ? 'active' : ''}`}
            onClick={() => setActiveTab('transformations')}
          >
            Transformations
          </button>
          <button 
            className={`tab-btn ${activeTab === 'site-settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('site-settings')}
          >
            Site Settings
          </button>
        </div>

        {loading ? (
          <p>Loading data...</p>
        ) : activeTab === 'plans' ? (
          <div>
            <div className="flex justify-between items-center mb-4" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3>Current Plans</h3>
              <button className="btn btn-primary btn-sm" onClick={() => openPlanModal()} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Plus size={18} /> Add Plan
              </button>
            </div>
            
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Popular</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {plans.map(plan => (
                    <tr key={plan.id}>
                      <td>{plan.name}</td>
                      <td>{plan.price}</td>
                      <td>{plan.is_popular ? 'Yes' : 'No'}</td>
                      <td>
                        <div className="action-btns">
                          <button className="btn btn-outline btn-sm" onClick={() => openPlanModal(plan)}>
                            <Edit size={16} />
                          </button>
                          <button className="btn btn-outline btn-sm text-danger" onClick={() => handleDeletePlan(plan.id)}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {plans.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center">No plans found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : activeTab === 'submissions' ? (
          <div>
            <h3 style={{ marginBottom: '1rem' }}>Customer Submissions</h3>
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Customer Name</th>
                    <th>Contact</th>
                    <th>Email</th>
                    <th>Selected Plan</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map(sub => (
                    <tr key={sub.id}>
                      <td>{new Date(sub.created_at).toLocaleDateString()}</td>
                      <td>{sub.customer_name}</td>
                      <td>{sub.contact}</td>
                      <td>{sub.email}</td>
                      <td><span className="popular-badge" style={{ position: 'static', padding: '0.2rem 0.6rem', transform: 'none' }}>{sub.plan_name}</span></td>
                      <td>
                        <button className="btn btn-outline btn-sm text-danger" onClick={() => handleDeleteSubmission(sub.id)}>
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {submissions.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center">No submissions yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : activeTab === 'site-settings' ? (
          <div>
            <h3 style={{ marginBottom: '1rem' }}>Site Settings</h3>
            <div className="data-table-container" style={{ padding: '2rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '12px' }}>
              
              <div style={{ marginBottom: '3rem' }}>
                <h4 style={{ marginBottom: '1rem', color: 'var(--accent-primary)' }}>Hero Section Image ("Redesign the way You Look")</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                  {siteSettings.hero_image && (
                    <img src={siteSettings.hero_image} alt="Hero" style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '8px' }} />
                  )}
                  <div style={{ flex: 1 }}>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => handleSettingImageUpload(e.target.files[0], 'hero_image')}
                      className="form-input"
                      style={{ padding: '0.5rem', marginBottom: '1rem' }}
                      disabled={uploadingSetting}
                    />
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Recommended: High quality image, transparent background or gym environment.</p>
                  </div>
                </div>
              </div>

              <hr style={{ borderColor: 'var(--border-color)', margin: '2rem 0' }} />

              <div>
                <h4 style={{ marginBottom: '1rem', color: 'var(--accent-primary)' }}>Profile Section Image ("Meet Bhanu Prasad Vulipe")</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                  {siteSettings.profile_image && (
                    <img src={siteSettings.profile_image} alt="Profile" style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '8px' }} />
                  )}
                  <div style={{ flex: 1 }}>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => handleSettingImageUpload(e.target.files[0], 'profile_image')}
                      className="form-input"
                      style={{ padding: '0.5rem', marginBottom: '1rem' }}
                      disabled={uploadingSetting}
                    />
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Recommended: Professional portrait, well-lit.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-4" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3>Client Transformations</h3>
              <button className="btn btn-primary btn-sm" onClick={() => setShowTransModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Plus size={18} /> Add Transformation
              </button>
            </div>
            
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Client Name</th>
                    <th>Time</th>
                    <th>Images</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transformations.map(trans => (
                    <tr key={trans.id}>
                      <td>{trans.name}</td>
                      <td>{trans.time}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <img src={trans.before_image_url} alt="Before" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                          <img src={trans.after_image_url} alt="After" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                        </div>
                      </td>
                      <td>
                        <button className="btn btn-outline btn-sm text-danger" onClick={() => handleDeleteTransformation(trans.id, trans.before_image_url, trans.after_image_url)}>
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {transformations.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center">No transformations added yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Plan Modal */}
      {showPlanModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowPlanModal(false)}><X size={24} /></button>
            <h3 style={{ marginTop: 0 }}>{editingPlan ? 'Edit Plan' : 'Add New Plan'}</h3>
            
            <form onSubmit={handlePlanSubmit} style={{ marginTop: '1.5rem' }}>
              <div className="form-group">
                <label>Plan Name</label>
                <input 
                  type="text" 
                  value={planForm.name}
                  onChange={e => setPlanForm({...planForm, name: e.target.value})}
                  required 
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Price</label>
                <input 
                  type="text" 
                  value={planForm.price}
                  onChange={e => setPlanForm({...planForm, price: e.target.value})}
                  required 
                  className="form-input"
                  placeholder="e.g. ₹15,000"
                />
              </div>
              <div className="form-group form-checkbox">
                <input 
                  type="checkbox" 
                  checked={planForm.is_popular}
                  onChange={e => setPlanForm({...planForm, is_popular: e.target.checked})}
                />
                <label style={{ margin: 0 }}>Mark as Most Popular</label>
              </div>
              
              <button type="submit" className="btn btn-primary w-100 mt-4">
                Save Plan
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Transformation Modal */}
      {showTransModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowTransModal(false)}><X size={24} /></button>
            <h3 style={{ marginTop: 0 }}>Add New Transformation</h3>
            
            <form onSubmit={handleTransSubmit} style={{ marginTop: '1.5rem' }}>
              <div className="form-group">
                <label>Client Name</label>
                <input 
                  type="text" 
                  value={transForm.name}
                  onChange={e => setTransForm({...transForm, name: e.target.value})}
                  required 
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Duration / Time (e.g. 12 Weeks)</label>
                <input 
                  type="text" 
                  value={transForm.time}
                  onChange={e => setTransForm({...transForm, time: e.target.value})}
                  required 
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Before Image</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={e => setTransForm({...transForm, beforeImage: e.target.files[0]})}
                  required 
                  className="form-input"
                  style={{ padding: '0.5rem' }}
                />
              </div>
              <div className="form-group">
                <label>After Image</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={e => setTransForm({...transForm, afterImage: e.target.files[0]})}
                  required 
                  className="form-input"
                  style={{ padding: '0.5rem' }}
                />
              </div>
              
              <button type="submit" className="btn btn-primary w-100 mt-4" disabled={uploadingImage}>
                {uploadingImage ? 'Uploading...' : 'Upload Transformation'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
