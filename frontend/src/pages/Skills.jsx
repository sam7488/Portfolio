import { useState, useEffect } from 'react';
import { Code2, Monitor, Database, Terminal, Users } from 'lucide-react';
import SEO from '../components/SEO';

const categoryIcons = {
  'Frontend': <Monitor size={24} className="text-primary" />,
  'Backend': <Database size={24} className="text-primary" />,
  'Database': <Database size={24} className="text-primary" />,
  'Tools': <Terminal size={24} className="text-primary" />,
  'CS Fundamentals': <Code2 size={24} className="text-primary" />,
  'Soft Skills': <Users size={24} className="text-primary" />,
  'Technical Skills': <Code2 size={24} className="text-primary" />,
  'Development Skills': <Monitor size={24} className="text-primary" />,
  'Additional Skills': <Terminal size={24} className="text-primary" />
};

const API_URL = import.meta.env.VITE_APP_API_URL;

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${VITE_APP_API_URL}/skills`)
      .then(res => res.json())
      .then(data => {
        setSkills(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <div className="page fade-in">
      <SEO 
        title="Skills | Sumit Sah" 
        description="A comprehensive list of my technical, development, and soft skills."
        path="/skills"
      />

      <section className="section" id="skills-section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-3xl)' }}>
            <span className="section-label" style={{ display: 'inline-block', margin: '0 auto' }}>My Expertise</span>
            <h1 className="section-title">Technical Skills</h1>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              A comprehensive overview of the technologies, tools, and concepts I've mastered over the course of my career and education.
            </p>
          </div>

          {loading ? (
            <div className="loading"><div className="spinner" /></div>
          ) : (
            <div style={{ display: 'grid', gap: 'var(--spacing-xl)' }}>
              {Object.keys(skillsByCategory).length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No skills found. Add some from the admin dashboard.</p>
              ) : (
                Object.entries(skillsByCategory).map(([category, items]) => (
                  <div key={category} className="card card-glass fade-in" style={{ padding: 'var(--spacing-xl)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: 'var(--spacing-lg)' }}>
                      <div className="btn-icon" style={{ background: 'var(--bg-tertiary)' }}>
                        {categoryIcons[category] || <Code2 size={24} className="text-primary" />}
                      </div>
                      <h2 style={{ fontSize: 'var(--fs-xl)', margin: 0 }}>{category}</h2>
                    </div>
                    
                    <div className="tags" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem' }}>
                      {items.map(skill => (
                        <div key={skill.id} className="skill-item card" style={{ padding: '1rem', textAlign: 'center', transition: 'transform 0.2s', cursor: 'default' }}>
                          <h4 style={{ fontWeight: 600, fontSize: '1rem', margin: 0 }}>{skill.name}</h4>
                          <div style={{ width: '100%', background: 'var(--border-color)', height: '4px', borderRadius: '2px', marginTop: '0.5rem' }}>
                            <div style={{ width: `${skill.level}%`, background: 'var(--primary-color)', height: '100%', borderRadius: '2px' }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
