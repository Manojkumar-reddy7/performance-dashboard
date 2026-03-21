import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import API from '../api/axios';
import Navbar from '../components/Navbar';

export default function Employee() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [kpis, setKpis] = useState([]);
  const [insights, setInsights] = useState(null);
  const [metric, setMetric] = useState('');
  const [target, setTarget] = useState('');
  const [actual, setActual] = useState('');
  const [period, setPeriod] = useState('');

  useEffect(() => { fetchAll(); }, []);

  async function fetchAll() {
    const [empRes, kpiRes, insRes] = await Promise.all([
      API.get(`/employees/${id}`),
      API.get(`/kpis/${id}`),
      API.get(`/kpis/insights/${id}`),
    ]);
    setEmployee(empRes.data);
    setKpis(kpiRes.data);
    setInsights(insRes.data);
  }

  async function addKpi(e) {
    e.preventDefault();
    await API.post('/kpis/', {
      employee_id: parseInt(id),
      metric_name: metric,
      target: parseFloat(target),
      actual: parseFloat(actual),
      period,
    });
    setMetric(''); setTarget(''); setActual(''); setPeriod('');
    fetchAll();
  }

  if (!employee) return <div style={{ padding: 40 }}>Loading...</div>;

  return (
    <div style={{ background: '#f0f2f5', minHeight: '100vh' }}>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.heading}>{employee.name}</h2>
        <p style={styles.sub}>{employee.role} · {employee.department}</p>

        {/* Insights */}
        {insights && (
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Performance Insights</h3>
            <p style={styles.score}>Average Score: <strong>{insights.average_score}%</strong></p>
            {insights.insights.map((ins, i) => (
              <p key={i} style={{ color: ins.includes('needs attention') ? '#ef4444' : '#22c55e', margin: '6px 0' }}>
                {ins.includes('needs attention') ? '⚠️' : '✅'} {ins}
              </p>
            ))}
          </div>
        )}

        {/* KPI Chart */}
        {kpis.length > 0 && (
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>KPI Scores Over Time</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={kpis}>
                <XAxis dataKey="period" />
                <YAxis domain={[0, 150]} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={2} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Add KPI Form */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Log New KPI</h3>
          <form onSubmit={addKpi} style={styles.form}>
            <input style={styles.input} placeholder="Metric (e.g. sales_target)" value={metric} onChange={e => setMetric(e.target.value)} required />
            <input style={styles.input} placeholder="Target" type="number" value={target} onChange={e => setTarget(e.target.value)} required />
            <input style={styles.input} placeholder="Actual" type="number" value={actual} onChange={e => setActual(e.target.value)} required />
            <input style={styles.input} placeholder="Period (e.g. 2025-Q1)" value={period} onChange={e => setPeriod(e.target.value)} required />
            <button style={styles.btn} type="submit">Log KPI</button>
          </form>
        </div>

        {/* KPI Table */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>All KPIs</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f3f4f6', textAlign: 'left' }}>
                {['Metric', 'Target', 'Actual', 'Period', 'Score'].map(h => (
                  <th key={h} style={{ padding: '10px', fontSize: '13px', color: '#6b7280' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {kpis.map(k => (
                <tr key={k.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={styles.td}>{k.metric_name}</td>
                  <td style={styles.td}>{k.target}</td>
                  <td style={styles.td}>{k.actual}</td>
                  <td style={styles.td}>{k.period}</td>
                  <td style={{ ...styles.td, color: k.score >= 100 ? '#22c55e' : k.score >= 70 ? '#f59e0b' : '#ef4444', fontWeight: 'bold' }}>
                    {k.score}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: '800px', margin: '0 auto', padding: '32px 16px' },
  heading: { fontSize: '26px', fontWeight: 'bold', color: '#1e1e2e', marginBottom: '4px' },
  sub: { color: '#6b7280', marginBottom: '24px' },
  card: { background: '#fff', borderRadius: '12px', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' },
  cardTitle: { fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#374151' },
  score: { fontSize: '18px', marginBottom: '12px' },
  form: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
  input: { flex: '1', minWidth: '150px', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' },
  btn: { padding: '10px 20px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  td: { padding: '10px', fontSize: '14px', color: '#374151' },
};    