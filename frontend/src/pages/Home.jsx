import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink, Github, Code2 } from 'lucide-react';
import SEO from '../components/SEO';

const API_URL = '';

export default function Home() {
  const [profile, setProfile] = useState(null);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [profileRes, projectsRes, skillsRes] = await Promise.all([
          fetch(`${API_URL}/api/profile`),
          fetch(`${API_URL}/api/projects/featured`),
          fetch(`${API_URL}/api/skills`),
        ]);
        setProfile(await profileRes.json());
        setFeaturedProjects(await projectsRes.json());
        setSkills(await skillsRes.json());
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Group skills by category
  const grouped = skills.reduce((acc, skill) => {
    (acc[skill.category] = acc[skill.category] || []).push(skill);
    return acc;
  }, {});

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
        title=""
        description="Sumit Sah — Full Stack Developer specializing in React, Node.js, and modern web technologies."
        path="/"
      />

      {/* ── Hero ────────────────────────────────────── */}
      <section className="hero" id="hero">
        <div className="hero-bg">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
        </div>
        <div className="container hero-content">
          <div className="hero-badge">
            <span className="dot" />
            Available for opportunities
          </div>
          <h1>
            Hi, I'm{' '}
            <span className="gradient-text">{profile?.name || 'Sumit Sah'}</span>
            <br />
            {profile?.title || 'Full Stack Developer'}
          </h1>
          <p className="hero-description">
            {profile?.bio ||
              'Passionate developer building modern, elegant web solutions with React, Node.js, and cutting-edge technologies.'}
          </p>
          <div className="hero-actions">
            <Link to="/projects" className="btn btn-primary">
              View My Work <ArrowRight size={16} />
            </Link>
            <Link to="/contact" className="btn btn-secondary">
              Get In Touch
            </Link>
          </div>
          <div className="hero-stats">
            <div>
              <div className="hero-stat-value">{featuredProjects.length}+</div>
              <div className="hero-stat-label">Featured Projects</div>
            </div>
            <div>
              <div className="hero-stat-value">{skills.length}+</div>
              <div className="hero-stat-label">Technologies</div>
            </div>
            <div>
              <div className="hero-stat-value">2+</div>
              <div className="hero-stat-label">Years Experience</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Projects ──────────────────────── */}
      <section className="section" id="featured-projects">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Portfolio</span>
            <h2 className="section-title">Featured Projects</h2>
            <p className="section-subtitle">
              A curated selection of my recent work across various domains
            </p>
          </div>
          <div className="projects-grid">
            {featuredProjects.map((project, i) => (
              <article
                key={project.id}
                className="card project-card fade-in"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="project-card-image">
                  <Code2 size={48} className="placeholder-icon" />
                </div>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="tags" style={{ marginBottom: 'var(--spacing-lg)' }}>
                  {project.tags?.map((tag) => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
                <div className="project-card-footer">
                  <div className="project-card-links">
                    {project.githubLink && (
                      <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="btn-icon" aria-label={`GitHub for ${project.title}`}>
                        <Github size={18} />
                      </a>
                    )}
                    {project.liveLink && (
                      <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="btn-icon" aria-label={`Live demo for ${project.title}`}>
                        <ExternalLink size={18} />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 'var(--spacing-2xl)' }}>
            <Link to="/projects" className="btn btn-secondary">
              View All Projects <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Skills Preview ──────────────────────────── */}
      <section className="section" id="skills-preview" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="section-header" style={{ marginBottom: 'var(--spacing-xl)' }}>
            <span className="section-label" style={{ display: 'inline-block', margin: '0 auto' }}>My Toolset</span>
            <h2 className="section-title">Core Technologies</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              A quick look at the primary technologies I use daily.
            </p>
          </div>
          
          <div className="tags" style={{ justifyContent: 'center', marginBottom: 'var(--spacing-2xl)', gap: '1rem' }}>
            {['HTML', 'CSS', 'React JS', 'Express JS', 'Java', 'PostgreSQL', 'Node.js', 'Git'].map(tech => (
              <span key={tech} className="tag" style={{ fontSize: '1.1rem', padding: '0.75rem 1.5rem', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>
                {tech}
              </span>
            ))}
          </div>

          <Link to="/skills" className="btn btn-primary" onClick={() => window.scrollTo(0, 0)}>
            Explore All Skills <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
