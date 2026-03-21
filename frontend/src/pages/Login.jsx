import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    try {
      const form = new URLSearchParams();
      form.append('username', email);
      form.append('password', password);

      const res = await API.post('/auth/login', form);
      localStorage.setItem('token', res.data.access_token);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>📊 Manager Login</h2>
        <form onSubmit={handleLogin}>
          <input
            style={styles.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {error && <p style={styles.error}>{error}</p>}
          <button style={styles.btn} type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    background: '#f0f2f5',
  },
  card: {
    background: '#fff', padding: '40px', borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '360px',
  },
  title: { textAlign: 'center', marginBottom: '24px', color: '#1e1e2e' },
  input: {
    width: '100%', padding: '12px', marginBottom: '16px',
    borderRadius: '8px', border: '1px solid #ddd',
    fontSize: '14px', boxSizing: 'border-box',
  },
  btn: {
    width: '100%', padding: '12px', background: '#4f46e5',
    color: '#fff', border: 'none', borderRadius: '8px',
    fontSize: '16px', cursor: 'pointer',
  },
  error: { color: '#e74c3c', marginBottom: '12px', fontSize: '14px' },
};