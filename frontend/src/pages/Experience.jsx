import { useEffect, useState } from 'react';
import { Briefcase, GraduationCap } from 'lucide-react';
import SEO from '../components/SEO';

const API_URL = '';

export default function Experience() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/experience`)
      .then((res) => res.json())
      .then(setExperiences)
      .catch((err) => console.error('Failed to fetch experience:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="page">
        <div className="loading"><div className="spinner" /></div>
      </div>
    );
  }

  return (
    <div className="page">
      <SEO
        title="Experience"
        description="My professional work experience and educational background in software development."
        path="/experience"
      />
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Journey</span>
            <h2 className="section-title">Experience & Education</h2>
            <p className="section-subtitle">
              My professional journey and academic background
            </p>
          </div>
          <div className="timeline">
            {experiences.map((exp, i) => (
              <div
                key={exp.id}
                className="timeline-item fade-in"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <div className="timeline-dot" />
                <div className="card">
                  <span className={`timeline-type-badge ${exp.type}`}>
                    {exp.type === 'education' ? (
                      <GraduationCap size={12} />
                    ) : (
                      <Briefcase size={12} />
                    )}
                    {exp.type === 'education' ? 'Education' : 'Work'}
                  </span>
                  <span className="timeline-duration">{exp.duration}</span>
                  <h3 className="timeline-title">{exp.title}</h3>
                  <p className="timeline-company">{exp.company}</p>
                  <p className="timeline-description">{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
