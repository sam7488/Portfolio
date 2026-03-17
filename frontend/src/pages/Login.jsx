import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Lock, User } from 'lucide-react';
import SEO from '../components/SEO';

const API_URL = import.meta.env.VITE_APP_API_URL;

export default function Login() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();
      if (res.ok) {
        login(data.token);
        navigate('/admin/dashboard');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Connection failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <SEO title="Admin Login" description="Secure access to the portfolio admin dashboard." path="/admin/login" />
      
      <div className="card card-glass fade-in" style={{ width: '100%', maxWidth: '400px', padding: 'var(--spacing-2xl)' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
          <div className="btn-icon" style={{ width: '60px', height: '60px', margin: '0 auto var(--spacing-md)' }}>
            <Lock size={28} />
          </div>
          <h2 className="section-title" style={{ fontSize: 'var(--fs-2xl)' }}>Admin Access</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)' }}>
            Enter your credentials to manage your portfolio
          </p>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                id="username"
                name="username"
                type="text"
                value={credentials.username}
                onChange={handleChange}
                placeholder="Username"
                style={{ paddingLeft: '40px' }}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                id="password"
                name="password"
                type="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="••••••••"
                style={{ paddingLeft: '40px' }}
                required
              />
            </div>
          </div>

          {error && <div className="form-message error">{error}</div>}

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', marginTop: 'var(--spacing-md)' }}>
            {loading ? 'Authenticating...' : 'Login'}
            <LogIn size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
