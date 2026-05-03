import { useState, useEffect } from 'react'
import { fetchProfile } from '../services/api'

function Profile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await fetchProfile()
        setProfile(data)
      } catch (err) {
        setError('Could not load profile. Make sure uvicorn is running.')
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [])

  if (loading) return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F7F4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#9CA3AF' }}>Loading profile...</p>
    </div>
  )

  if (error) return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F7F4', padding: '32px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: '12px', padding: '24px', color: '#DC2626' }}>
        <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>⚠️ {error}</p>
      </div>
    </div>
  )

  const stats = [
    { num: `${profile.stats.profile_score}%`, label: 'Profile Score' },
    { num: profile.stats.applications, label: 'Applications' },
    { num: profile.stats.interviews, label: 'Interviews' },
    { num: `${profile.stats.experience_years}yr`, label: 'Experience' },
  ]

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F7F4', padding: '32px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>

        <h2 style={{ color: '#1A1A2E', fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '24px' }}>My Profile</h2>

        <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '24px', marginBottom: '16px', border: '1px solid #E5E7EB', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
            <div style={{ width: '60px', height: '60px', backgroundColor: '#E08A00', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#fff', fontSize: '18px', flexShrink: 0 }}>
              {profile.initials}
            </div>
            <div>
              <h3 style={{ color: '#1A1A2E', fontWeight: 'bold', fontSize: '20px' }}>{profile.name}</h3>
              <p style={{ color: '#E08A00', fontSize: '14px', marginTop: '3px' }}>{profile.title} · {profile.location}</p>
              <p style={{ color: '#9CA3AF', fontSize: '13px', marginTop: '3px' }}>{profile.experience_years} years experience · {profile.status}</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
            {stats.map(stat => (
              <div key={stat.label} style={{ backgroundColor: '#F9FAFB', borderRadius: '8px', padding: '12px', textAlign: 'center', border: '1px solid #F3F4F6' }}>
                <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#E08A00', lineHeight: '1' }}>{stat.num}</div>
                <div style={{ color: '#9CA3AF', fontSize: '10px', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '24px', marginBottom: '16px', border: '1px solid #E5E7EB', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <h4 style={{ color: '#1A1A2E', fontWeight: 'bold', marginBottom: '16px', fontSize: '15px' }}>Skills</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {profile.skills.map(skill => (
              <span key={skill} style={{ backgroundColor: 'rgba(224,138,0,0.08)', border: '1px solid rgba(224,138,0,0.2)', color: '#E08A00', borderRadius: '20px', padding: '5px 14px', fontSize: '13px', fontWeight: '500' }}>
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '24px', border: '1px solid #E5E7EB', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <h4 style={{ color: '#1A1A2E', fontWeight: 'bold', marginBottom: '12px', fontSize: '15px' }}>About</h4>
          <p style={{ color: '#6B7280', fontSize: '14px', lineHeight: '1.7' }}>{profile.bio}</p>
        </div>

        <a href="/jobs" style={{ display: 'block', textAlign: 'center', backgroundColor: '#E08A00', color: '#fff', padding: '14px', borderRadius: '10px', fontWeight: 'bold', textDecoration: 'none', fontSize: '15px', marginTop: '20px', boxShadow: '0 4px 14px rgba(224,138,0,0.25)' }}>
          View My AI Job Matches →
        </a>

      </div>
    </div>
  )
}

export default Profile
