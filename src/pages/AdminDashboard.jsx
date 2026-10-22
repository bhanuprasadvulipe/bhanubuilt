import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import toast, { Toaster } from 'react-hot-toast';
import { Edit, Trash2, Plus, LogOut, X, Crop, Upload, Eye } from 'lucide-react';
import ImageCropperModal from '../components/ImageCropperModal';
import './Admin.css';

const DEFAULT_HERO_IMAGE = 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1000&auto=format&fit=crop';
const DEFAULT_PROFILE_IMAGE = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop';

const AdminDashboard = () => {
  const [session, setSession] = useState(null);
  const [activeTab, setActiveTab] = useState('plans'); // 'plans', 'submissions', 'transformations', 'site-settings'
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

  // Cropper Modal State
  const [cropperModal, setCropperModal] = useState({
    isOpen: false,
    imageSrc: '',
    sectionType: 'hero'
  });
  const heroFileInputRef = useRef(null);
  const profileFileInputRef = useRef(null);

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
      const ext = (file.name && file.name.includes('.')) ? file.name.split('.').pop() : 'jpg';
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
      // If offline/dormant, still update local state preview so admin can test visually
      if (file instanceof Blob || file instanceof File) {
        const localUrl = URL.createObjectURL(file);
        setSiteSettings(prev => ({ ...prev, [keyName]: localUrl }));
      }
      toast.error('Image adjusted locally (Supabase storage offline)');
    } finally {
      setUploadingSetting(false);
    }
  };

  const handleFileSelectForCropper = (file, sectionType) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCropperModal({
        isOpen: true,
        imageSrc: reader.result,
        sectionType
      });
    };
    reader.readAsDataURL(file);
  };

  const openCropperForCurrent = (sectionType) => {
    const currentSrc = sectionType === 'hero' 
      ? (siteSettings.hero_image || DEFAULT_HERO_IMAGE) 
      : (siteSettings.profile_image || DEFAULT_PROFILE_IMAGE);

    setCropperModal({
      isOpen: true,
      imageSrc: currentSrc,
      sectionType
    });
  };

  const handleCroppedSave = async (croppedBlob) => {
    const keyName = cropperModal.sectionType === 'hero' ? 'hero_image' : 'profile_image';
    const fileName = `${Date.now()}_${keyName}.jpg`;
    const file = new File([croppedBlob], fileName, { type: 'image/jpeg' });
    
    await handleSettingImageUpload(file, keyName);
    setCropperModal(prev => ({ ...prev, isOpen: false }));
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
            <div className="settings-header-banner">
              <h3>Site Settings & Image Studio</h3>
              <p className="text-secondary">
                Preview, adjust, and crop your live website images in the exact aspect ratio and layout as they appear on the main page.
              </p>
            </div>

            <div className="settings-studio-grid">
              {/* Hero Image Studio Card */}
              <div className="settings-card">
                <div className="settings-card-header">
                  <h4>Hero Section Banner ("Redesign the way You Look")</h4>
                  <span className="aspect-badge">Aspect: 4:5 Mobile / 16:9 Desktop</span>
                </div>

                <div className="preview-label-tag">
                  <Eye size={14} /> Live Main Page Preview:
                </div>

                {/* Hero Mini Mockup */}
                <div className="settings-live-preview">
                  <div className="mini-hero-mockup">
                    <div className="mini-hero-content">
                      <span className="mini-badge">Online Personal Training</span>
                      <h5>Redesign the way <span>You Look</span></h5>
                      <p>Custom coaching by Bhanu</p>
                    </div>
                    <div className="mini-hero-img-wrap">
                      <img 
                        src={siteSettings.hero_image || DEFAULT_HERO_IMAGE} 
                        alt="Hero Live Preview" 
                      />
                    </div>
                  </div>
                </div>

                <div className="settings-card-actions">
                  <input 
                    type="file" 
                    ref={heroFileInputRef} 
                    accept="image/*" 
                    onChange={(e) => {
                      handleFileSelectForCropper(e.target.files[0], 'hero');
                      e.target.value = '';
                    }} 
                    style={{ display: 'none' }} 
                  />
                  <button 
                    type="button" 
                    className="btn btn-primary"
                    onClick={() => heroFileInputRef.current?.click()}
                    disabled={uploadingSetting}
                  >
                    <Upload size={16} /> Upload & Crop New
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-outline"
                    onClick={() => openCropperForCurrent('hero')}
                    disabled={uploadingSetting}
                  >
                    <Crop size={16} /> Adjust Current
                  </button>
                </div>

                <p className="settings-card-hint">
                  💡 <strong>How it looks:</strong> The hero photo is displayed on the right with a smooth fade behind the title. Keep face/chest in the upper-right area for best framing.
                </p>
              </div>

              {/* Profile Image Studio Card */}
              <div className="settings-card">
                <div className="settings-card-header">
                  <h4>Profile Section Photo ("Meet Bhanu Prasad Vulipe")</h4>
                  <span className="aspect-badge">Aspect: 3:4 Portrait</span>
                </div>

                <div className="preview-label-tag">
                  <Eye size={14} /> Live Main Page Preview:
                </div>

                {/* Profile Mini Mockup */}
                <div className="settings-live-preview">
                  <div className="mini-profile-mockup">
                    <div className="mini-profile-img-wrap">
                      <img 
                        src={siteSettings.profile_image || DEFAULT_PROFILE_IMAGE} 
                        alt="Profile Live Preview" 
                      />
                      <div className="mini-exp-badge">
                        <span className="mini-exp-years">7+</span>
                        <span className="mini-exp-text">Years<br/>Exp</span>
                      </div>
                    </div>
                    <div className="mini-profile-content">
                      <h5>Meet <span>Bhanu Prasad Vulipe</span></h5>
                      <p>Professional fitness coach & physique athlete</p>
                    </div>
                  </div>
                </div>

                <div className="settings-card-actions">
                  <input 
                    type="file" 
                    ref={profileFileInputRef} 
                    accept="image/*" 
                    onChange={(e) => {
                      handleFileSelectForCropper(e.target.files[0], 'profile');
                      e.target.value = '';
                    }} 
                    style={{ display: 'none' }} 
                  />
                  <button 
                    type="button" 
                    className="btn btn-primary"
                    onClick={() => profileFileInputRef.current?.click()}
                    disabled={uploadingSetting}
                  >
                    <Upload size={16} /> Upload & Crop New
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-outline"
                    onClick={() => openCropperForCurrent('profile')}
                    disabled={uploadingSetting}
                  >
                    <Crop size={16} /> Adjust Current
                  </button>
                </div>

                <p className="settings-card-hint">
                  💡 <strong>How it looks:</strong> Displayed as a vertical portrait with rounded corners and the golden 7+ Years Experience badge in the bottom-right corner.
                </p>
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
      {/* Image Crop & Adjust Modal */}
      <ImageCropperModal 
        isOpen={cropperModal.isOpen}
        onClose={() => setCropperModal(prev => ({ ...prev, isOpen: false }))}
        imageSrc={cropperModal.imageSrc}
        sectionType={cropperModal.sectionType}
        onSave={handleCroppedSave}
        isSaving={uploadingSetting}
      />
    </div>
  );
};

export default AdminDashboard;
