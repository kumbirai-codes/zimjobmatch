function Home() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F7F4', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', padding: '24px', textAlign: 'center' }}>

      <div style={{ backgroundColor: 'rgba(45,125,70,0.1)', color: '#2D7D46', border: '1px solid rgba(45,125,70,0.25)', borderRadius: '20px', padding: '5px 14px', fontSize: '13px', fontWeight: '500' }}>
        🇿🇼 Built for Zimbabwe
      </div>

      <h1 style={{ fontSize: '3.2rem', fontWeight: 'bold', color: '#1A1A2E', lineHeight: '1.1', maxWidth: '560px' }}>
        Find your perfect job with <span style={{ color: '#E08A00' }}>AI matching</span>
      </h1>

      <p style={{ color: '#6B7280', fontSize: '1.1rem', maxWidth: '460px', lineHeight: '1.7' }}>
        ZimJobMatch uses AI to connect Zimbabwean professionals to the right opportunity — and tells you exactly why you're a match.
      </p>

      <div style={{ display: 'flex', gap: '12px', marginTop: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <a href="/jobs" style={{ backgroundColor: '#E08A00', color: '#fff', padding: '13px 28px', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none', fontSize: '15px', boxShadow: '0 4px 14px rgba(224,138,0,0.3)' }}>
          Find Jobs →
        </a>
        <a href="/profile" style={{ backgroundColor: '#fff', color: '#1A1A2E', padding: '13px 28px', borderRadius: '8px', fontWeight: '500', textDecoration: 'none', fontSize: '15px', border: '1px solid #E5E7EB' }}>
          My Profile
        </a>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '48px', maxWidth: '540px', width: '100%' }}>
        {[
          { num: '2,847', label: 'Active Jobs' },
          { num: '94%', label: 'Match Accuracy' },
          { num: '500+', label: 'Companies' },
        ].map(stat => (
          <div key={stat.label} style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '20px', textAlign: 'center', border: '1px solid #E5E7EB', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#E08A00' }}>{stat.num}</div>
            <div style={{ color: '#9CA3AF', fontSize: '12px', marginTop: '4px' }}>{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home
