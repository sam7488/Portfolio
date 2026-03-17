import { useEffect, useState } from 'react';
import { ExternalLink, Github, Code2 } from 'lucide-react';
import SEO from '../components/SEO';

const API_URL = import.meta.env.VITE_APP_API_URL;

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/projects`)
      .then((res) => res.json())
      .then(setProjects)
      .catch((err) => console.error('Failed to fetch projects:', err))
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
        title="Projects"
        description="Explore my portfolio of web development projects built with React, Node.js, PostgreSQL and more."
        path="/projects"
      />
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">My Work</span>
            <h2 className="section-title">All Projects</h2>
            <p className="section-subtitle">
              A collection of projects showcasing my skills and experience
            </p>
          </div>
          <div className="projects-grid">
            {projects.map((project, i) => (
              <article
                key={project.id}
                className="card project-card fade-in"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className="project-card-image">
                  {project.imageUrl ? (
                    <img src={project.imageUrl} alt={project.title} />
                  ) : (
                    <Code2 size={48} className="placeholder-icon" />
                  )}
                </div>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="tags" style={{ marginBottom: 'var(--spacing-lg)' }}>
                  {project.tags?.map((tag) => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
                <div className="project-card-footer">
                  {project.featured && (
                    <span className="tag" style={{ background: 'hsla(145,70%,50%,0.1)', color: 'var(--success)', borderColor: 'hsla(145,70%,50%,0.2)' }}>
                      Featured
                    </span>
                  )}
                  <div className="project-card-links" style={{ marginLeft: 'auto' }}>
                    {project.githubLink && (
                      <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="btn-icon" aria-label={`GitHub repo for ${project.title}`}>
                        <Github size={18} />
                      </a>
                    )}
                    {project.liveLink && (
                      <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="btn-icon" aria-label={`Live demo of ${project.title}`}>
                        <ExternalLink size={18} />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
