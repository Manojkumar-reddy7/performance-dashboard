import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import API from '../api/axios';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [scores, setScores] = useState([]);
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => { fetchEmployees(); }, []);

  async function fetchEmployees() {
    const res = await API.get('/employees/');
    setEmployees(res.data);
    const scoreData = await Promise.all(
      res.data.map(async emp => {
        const ins = await API.get(`/kpis/insights/${emp.id}`);
        return { name: emp.name, score: ins.data.average_score };
      })
    );
    setScores(scoreData);
  }

  async function addEmployee(e) {
    e.preventDefault();
    await API.post('/employees/', { name, department, role });
    setName(''); setDepartment(''); setRole('');
    fetchEmployees();
  }

  return (
    <div style={{ background: '#f0f2f5', minHeight: '100vh' }}>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.heading}>Team Overview</h2>

        {/* Chart */}
        {scores.length > 0 && (
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Performance Scores</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={scores}>
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                  {scores.map((entry, i) => (
                    <Cell key={i} fill={entry.score >= 100 ? '#22c55e' : entry.score >= 70 ? '#f59e0b' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Add Employee Form */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Add Employee</h3>
          <form onSubmit={addEmployee} style={styles.form}>
            <input style={styles.input} placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
            <input style={styles.input} placeholder="Department" value={department} onChange={e => setDepartment(e.target.value)} required />
            <input style={styles.input} placeholder="Role" value={role} onChange={e => setRole(e.target.value)} required />
            <button style={styles.btn} type="submit">Add</button>
          </form>
        </div>

        {/* Employee List */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Employees</h3>
          {employees.map(emp => (
            <div key={emp.id} style={styles.empRow} onClick={() => navigate(`/employee/${emp.id}`)}>
              <div>
                <strong>{emp.name}</strong>
                <span style={styles.tag}>{emp.department}</span>
              </div>
              <span style={styles.role}>{emp.role} →</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: '800px', margin: '0 auto', padding: '32px 16px' },
  heading: { fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', color: '#1e1e2e' },
  card: { background: '#fff', borderRadius: '12px', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' },
  cardTitle: { fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#374151' },
  form: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
  input: { flex: '1', minWidth: '150px', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' },
  btn: { padding: '10px 20px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  empRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', borderRadius: '8px', marginBottom: '8px', background: '#f9fafb', cursor: 'pointer' },
  tag: { marginLeft: '10px', background: '#e0e7ff', color: '#4f46e5', padding: '2px 10px', borderRadius: '20px', fontSize: '12px' },
  role: { color: '#6b7280', fontSize: '14px' },
};