export default function AdminDashboard() {
  return (
    <div>
      <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>Admin Dashboard</h1>
      <p style={{ color: '#9ca3af' }}>Welcome to the KoreaBridge Management Portal.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginTop: '40px' }}>
        <div style={{ background: '#111827', padding: '20px', borderRadius: '12px' }}>
          <h3>Total Users</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#00e5ff' }}>142</p>
        </div>
        <div style={{ background: '#111827', padding: '20px', borderRadius: '12px' }}>
          <h3>Active Subscriptions</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#00e676' }}>48</p>
        </div>
      </div>
    </div>
  );
}
