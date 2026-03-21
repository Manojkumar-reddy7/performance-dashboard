import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem('token');
    navigate('/login');
  }

  return (
    <nav style={styles.nav}>
      <span style={styles.brand}>📊 Performance Dashboard</span>
      <button onClick={logout} style={styles.btn}>Logout</button>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '14px 32px', background: '#1e1e2e', color: '#fff',
  },
  brand: { fontSize: '18px', fontWeight: 'bold' },
  btn: {
    background: '#e74c3c', color: '#fff', border: 'none',
    padding: '8px 16px', borderRadius: '6px', cursor: 'pointer',
  },
};