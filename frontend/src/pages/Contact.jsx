import { useState } from 'react';
import { Send, Mail, MapPin, Github, Linkedin } from 'lucide-react';
import SEO from '../components/SEO';

const API_URL = import.meta.env.VITE_APP_API_URL;

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', content: '' });
  const [status, setStatus] = useState(null); // 'success' | 'error'
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);

    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', subject: '', content: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page">
      <SEO
        title="Contact"
        description="Get in touch with Sumit Sah. Let's discuss your next project or collaboration opportunity."
        path="/contact"
      />
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Get In Touch</span>
            <h2 className="section-title">Contact Me</h2>
            <p className="section-subtitle">
              Have a project idea or want to collaborate? Let's talk!
            </p>
          </div>

          <div className="contact-grid">
            {/* Left – Info */}
            <div className="contact-info fade-in">
              <h3>Let's work together</h3>
              <p>
                I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision. Feel free to reach out!
              </p>

              <div className="contact-detail">
                <div className="contact-detail-icon"><Mail size={20} /></div>
                <span>sahsumit7488@gmail.com</span>
              </div>
              <div className="contact-detail">
                <div className="contact-detail-icon"><MapPin size={20} /></div>
                <span>Nepal</span>
              </div>

              <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginTop: 'var(--spacing-lg)' }}>
                <a href="https://github.com/sam7488" target="_blank" rel="noopener noreferrer" className="btn-icon" aria-label="GitHub">
                  <Github size={18} />
                </a>
                <a href="https://www.linkedin.com/in/sumit-kumar-sah-503ab4287/" target="_blank" rel="noopener noreferrer" className="btn-icon" aria-label="LinkedIn">
                  <Linkedin size={18} />
                </a>
              </div>
            </div>

            {/* Right – Form */}
            <form className="contact-form card card-glass fade-in fade-in-delay-1" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Name *</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  placeholder="What's this about?"
                  value={form.subject}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="content">Message *</label>
                <textarea
                  id="content"
                  name="content"
                  placeholder="Tell me about your project..."
                  value={form.content}
                  onChange={handleChange}
                  required
                />
              </div>

              {status === 'success' && (
                <div className="form-message success">
                  ✅ Message sent successfully! I'll get back to you soon.
                </div>
              )}
              {status === 'error' && (
                <div className="form-message error">
                  ❌ Something went wrong. Please try again.
                </div>
              )}

              <button type="submit" className="btn btn-primary" disabled={submitting} style={{ alignSelf: 'flex-start' }}>
                {submitting ? 'Sending...' : 'Send Message'}
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
