import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Plus, Trash2, Edit2, LayoutDashboard, Briefcase, Code, PlusCircle, LogOut, X } from 'lucide-react';
import SEO from '../components/SEO';

const API_URL = import.meta.env.VITE_APP_API_URL;

// ─── Reusable Modal Component ─────────────────────────────────
function Modal({ title, isOpen, onClose, children }) {
  if (!isOpen) return null;
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
        <button onClick={onClose} className="btn-icon" style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
          <X size={20} />
        </button>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>{title}</h2>
        {children}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { token, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [projects, setProjects] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('projects');

  // Modal states
  const [isProjectModalOpen, setProjectModalOpen] = useState(false);
  const [isExperienceModalOpen, setExperienceModalOpen] = useState(false);
  const [isSkillModalOpen, setSkillModalOpen] = useState(false);
  
  // Form states
  const [projectForm, setProjectForm] = useState({ title: '', description: '', imageUrl: '', liveLink: '', githubLink: '', tags: '', featured: false });
  const [experienceForm, setExperienceForm] = useState({ title: '', company: '', duration: '', description: '', type: 'work' });
  const [skillForm, setSkillForm] = useState({ name: '', category: 'Frontend', level: 80 });

  // Edit mode state
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) navigate('/admin/login');
  }, [isAuthenticated, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pRes, eRes, sRes] = await Promise.all([
        fetch(`${API_URL}/api/projects`),
        fetch(`${API_URL}/api/experience`),
        fetch(`${API_URL}/api/skills`),
      ]);
      setProjects(await pRes.json());
      setExperiences(await eRes.json());
      setSkills(await sRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchData();
  }, [isAuthenticated]);

  const handleDelete = async (type, id) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;
    try {
      const res = await fetch(`${API_URL}/api/${type}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchData();
    } catch (err) {
      alert('Delete failed');
    }
  };

  // ─── Form Handlers ──────────────────────────────────────────

  const resetForms = () => {
    setProjectForm({ title: '', description: '', imageUrl: '', liveLink: '', githubLink: '', tags: '', featured: false });
    setExperienceForm({ title: '', company: '', duration: '', description: '', type: 'work' });
    setSkillForm({ name: '', category: 'Frontend', level: 80 });
    setEditingId(null);
  };

  const openEditModal = (type, item) => {
    setEditingId(item.id);
    if (type === 'projects') {
      setProjectForm({ ...item, tags: item.tags.join(', ') || '', imageUrl: item.imageUrl || '', liveLink: item.liveLink || '', githubLink: item.githubLink || '' });
      setProjectModalOpen(true);
    } else if (type === 'experience') {
      setExperienceForm(item);
      setExperienceModalOpen(true);
    } else if (type === 'skills') {
      setSkillForm(item);
      setSkillModalOpen(true);
    }
  };

  const submitForm = async (e, type, formData) => {
    e.preventDefault();
    const isEditing = !!editingId;
    const url = isEditing ? `${API_URL}/api/${type}/${editingId}` : `${API_URL}/api/${type}`;
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setProjectModalOpen(false);
        setExperienceModalOpen(false);
        setSkillModalOpen(false);
        resetForms();
        fetchData();
      } else {
        alert('Failed to save data. Please check inputs.');
      }
    } catch (err) {
      alert('Network error. Failed to save.');
    }
  };

  const handleProjectSubmit = (e) => {
    // Convert comma-separated string back to array
    const tagsArray = projectForm.tags.split(',').map(t => t.trim()).filter(t => t);
    submitForm(e, 'projects', { ...projectForm, tags: tagsArray });
  };

  const handleExperienceSubmit = (e) => submitForm(e, 'experience', experienceForm);
  const handleSkillSubmit = (e) => submitForm(e, 'skills', { ...skillForm, level: parseInt(skillForm.level) });

  if (!isAuthenticated) return null;

  return (
    <div className="page">
      <SEO title="Admin Dashboard" description="Manage your portfolio content." path="/admin/dashboard" />
      
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-3xl)' }}>
            <div>
              <span className="section-label">Control Panel</span>
              <h1 className="section-title" style={{ margin: 0 }}>Dashboard</h1>
            </div>
            <button onClick={logout} className="btn btn-secondary" style={{ borderColor: 'var(--error)', color: 'var(--error)' }}>
              Logout <LogOut size={16} />
            </button>
          </div>

          <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-2xl)' }}>
            <button className={`btn ${activeTab === 'projects' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('projects')}>
              <LayoutDashboard size={16} /> Projects
            </button>
            <button className={`btn ${activeTab === 'experience' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('experience')}>
              <Briefcase size={16} /> Experience
            </button>
            <button className={`btn ${activeTab === 'skills' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('skills')}>
              <Code size={16} /> Skills
            </button>
          </div>

          <div className="card card-glass fade-in">
            {loading ? (
              <div className="loading"><div className="spinner" /></div>
            ) : (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
                  <h2 style={{ fontSize: 'var(--fs-xl)' }}>Manage {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
                  <button 
                    className="btn btn-primary btn-sm" 
                    onClick={() => {
                      resetForms();
                      if (activeTab === 'projects') setProjectModalOpen(true);
                      if (activeTab === 'experience') setExperienceModalOpen(true);
                      if (activeTab === 'skills') setSkillModalOpen(true);
                    }}
                    style={{ padding: '0.5rem 1rem' }}
                  >
                    <PlusCircle size={16} /> Add New
                  </button>
                </div>

                <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                  {/* PROJECT LIST */}
                  {activeTab === 'projects' && projects.map(p => (
                    <div key={p.id} className="card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ fontWeight: 600, fontSize: '1.2rem', marginBottom: '0.25rem' }}>
                          {p.title} {p.featured && <span style={{fontSize:'0.7rem', background:'var(--success)', color:'black', padding:'2px 6px', borderRadius:'10px', marginLeft:'8px'}}>Featured</span>}
                        </h4>
                        <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{p.description.substring(0, 100)}...</p>
                        <div className="tags">
                          {p.tags.map(t => <span key={t} className="tag">{t}</span>)}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn-icon" title="Edit" onClick={() => openEditModal('projects', p)}><Edit2 size={16} /></button>
                        <button className="btn-icon" style={{ color: 'var(--error)' }} onClick={() => handleDelete('projects', p.id)}><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))}

                  {/* EXPERIENCE LIST */}
                  {activeTab === 'experience' && experiences.map(e => (
                    <div key={e.id} className="card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ fontWeight: 600, fontSize: '1.2rem', marginBottom: '0.25rem' }}>{e.title}</h4>
                        <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>{e.company} | {e.duration}</p>
                        <span className={`timeline-type-badge ${e.type}`} style={{marginTop: '0.5rem'}}>{e.type}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn-icon" title="Edit" onClick={() => openEditModal('experience', e)}><Edit2 size={16} /></button>
                        <button className="btn-icon" style={{ color: 'var(--error)' }} onClick={() => handleDelete('experience', e.id)}><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))}

                  {/* SKILL LIST */}
                  {activeTab === 'skills' && skills.map(s => (
                    <div key={s.id} className="card" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ fontWeight: 600, fontSize: '1.1rem' }}>{s.name}</h4>
                        <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-tertiary)' }}>{s.category} | {s.level}%</p>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn-icon" title="Edit" onClick={() => openEditModal('skills', s)}><Edit2 size={16} /></button>
                        <button className="btn-icon" style={{ color: 'var(--error)' }} onClick={() => handleDelete('skills', s.id)}><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))}

                  {/* EMPTY STATES */}
                  {((activeTab === 'projects' && projects.length === 0) || 
                    (activeTab === 'experience' && experiences.length === 0) ||
                    (activeTab === 'skills' && skills.length === 0)) && (
                    <p style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                      No {activeTab} found. Click "Add New" to get started!
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── Modals ─────────────────────────────────────────────────── */}

      <Modal title={editingId ? "Edit Project" : "Add New Project"} isOpen={isProjectModalOpen} onClose={() => { setProjectModalOpen(false); resetForms(); }}>
        <form onSubmit={handleProjectSubmit} className="contact-form">
          <div className="form-group">
            <label>Project Title *</label>
            <input required type="text" value={projectForm.title} onChange={e => setProjectForm({...projectForm, title: e.target.value})} placeholder="e.g. E-Commerce Platform" />
          </div>
          <div className="form-group">
            <label>Description *</label>
            <textarea required value={projectForm.description} onChange={e => setProjectForm({...projectForm, description: e.target.value})} placeholder="Describe your project..." style={{ minHeight: '100px' }} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>GitHub Repository URL</label>
              <input type="url" value={projectForm.githubLink} onChange={e => setProjectForm({...projectForm, githubLink: e.target.value})} placeholder="https://github.com/..." />
            </div>
            <div className="form-group">
              <label>Live Demo URL</label>
              <input type="url" value={projectForm.liveLink} onChange={e => setProjectForm({...projectForm, liveLink: e.target.value})} placeholder="https://..." />
            </div>
          </div>
          <div className="form-group">
            <label>Image URL (Optional)</label>
            <input type="url" value={projectForm.imageUrl} onChange={e => setProjectForm({...projectForm, imageUrl: e.target.value})} placeholder="https://unsplash.com/..." />
          </div>
          <div className="form-group">
            <label>Tags (comma separated)</label>
            <input type="text" value={projectForm.tags} onChange={e => setProjectForm({...projectForm, tags: e.target.value})} placeholder="React, Node.js, PostgreSQL" />
          </div>
          <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
            <input type="checkbox" id="featured" checked={projectForm.featured} onChange={e => setProjectForm({...projectForm, featured: e.target.checked})} style={{ width: 'auto' }} />
            <label htmlFor="featured" style={{ margin: 0 }}>Featured Project (Shows on Home Page)</label>
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Save Project</button>
        </form>
      </Modal>

      <Modal title={editingId ? "Edit Experience" : "Add New Experience"} isOpen={isExperienceModalOpen} onClose={() => { setExperienceModalOpen(false); resetForms(); }}>
        <form onSubmit={handleExperienceSubmit} className="contact-form">
          <div className="form-row">
            <div className="form-group">
              <label>Job Title / Degree *</label>
              <input required type="text" value={experienceForm.title} onChange={e => setExperienceForm({...experienceForm, title: e.target.value})} placeholder="Full Stack Developer" />
            </div>
            <div className="form-group">
              <label>Company / Institution *</label>
              <input required type="text" value={experienceForm.company} onChange={e => setExperienceForm({...experienceForm, company: e.target.value})} placeholder="Tech Corp" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Duration *</label>
              <input required type="text" value={experienceForm.duration} onChange={e => setExperienceForm({...experienceForm, duration: e.target.value})} placeholder="Jan 2023 - Present" />
            </div>
            <div className="form-group">
              <label>Type *</label>
              <select 
                value={experienceForm.type} 
                onChange={e => setExperienceForm({...experienceForm, type: e.target.value})}
                style={{ padding: '0.875rem 1rem', background: 'var(--bg-secondary)', border: '1.5px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'white', outline: 'none' }}
              >
                <option value="work">Work Experience</option>
                <option value="education">Education</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Description *</label>
            <textarea required value={experienceForm.description} onChange={e => setExperienceForm({...experienceForm, description: e.target.value})} placeholder="What did you do there?" style={{ minHeight: '100px' }} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Save Experience</button>
        </form>
      </Modal>

      <Modal title={editingId ? "Edit Skill" : "Add New Skill"} isOpen={isSkillModalOpen} onClose={() => { setSkillModalOpen(false); resetForms(); }}>
        <form onSubmit={handleSkillSubmit} className="contact-form">
          <div className="form-group">
            <label>Skill Name *</label>
            <input required type="text" value={skillForm.name} onChange={e => setSkillForm({...skillForm, name: e.target.value})} placeholder="e.g. React.js" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Category *</label>
              <input required type="text" value={skillForm.category} list="categories" onChange={e => setSkillForm({...skillForm, category: e.target.value})} placeholder="Frontend" />
              <datalist id="categories">
                <option value="Technical Skills" />
                <option value="CS Fundamentals" />
                <option value="Development Skills" />
                <option value="Additional Skills" />
                <option value="Soft Skills" />
                <option value="Frontend" />
                <option value="Backend" />
                <option value="Database" />
                <option value="Tools" />
              </datalist>
            </div>
            <div className="form-group">
              <label>Proficiency Level (%) *</label>
              <input required type="number" min="0" max="100" value={skillForm.level} onChange={e => setSkillForm({...skillForm, level: e.target.value})} />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Save Skill</button>
        </form>
      </Modal>

    </div>
  );
}
