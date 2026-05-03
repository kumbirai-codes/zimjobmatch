import { useLocation } from 'react-router-dom'

const links = [
  { path: '/', label: 'Home' },
  { path: '/jobs', label: 'Jobs' },
  { path: '/profile', label: 'Profile' },
]

function Navbar() {
  const { pathname } = useLocation()

  return (
    <nav style={{
      backgroundColor: '#fff',
      borderBottom: '1px solid #E5E7EB',
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '60px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    }}>

      {/* Logo */}
      <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: '32px', height: '32px', backgroundColor: '#E08A00', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px', color: '#fff' }}>
          ZJM
        </div>
        <span style={{ color: '#1A1A2E', fontWeight: 'bold', fontSize: '16px' }}>
          Zim<span style={{ color: '#E08A00' }}>Job</span>Match
        </span>
      </a>

      {/* Links */}
      <div style={{ display: 'flex', gap: '4px' }}>
        {links.map(link => {
          const active = pathname === link.path || (link.path === '/jobs' && pathname.startsWith('/jobs'))
          return (
            <a key={link.path} href={link.path} style={{
              padding: '7px 16px',
              borderRadius: '7px',
              fontSize: '14px',
              fontWeight: active ? '700' : '500',
              textDecoration: 'none',
              backgroundColor: active ? '#E08A00' : 'transparent',
              color: active ? '#fff' : '#6B7280',
              transition: 'all 0.15s',
            }}>
              {link.label}
            </a>
          )
        })}
      </div>

      {/* Live Badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(45,125,70,0.08)', border: '1px solid rgba(45,125,70,0.2)', borderRadius: '20px', padding: '5px 12px', fontSize: '12px', color: '#2D7D46', fontWeight: '500' }}>
        <div style={{ width: '7px', height: '7px', backgroundColor: '#2D7D46', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
        AI Live
      </div>
    </nav>
  )
}

export default Navbar
