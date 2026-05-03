import { useState, useEffect } from 'react'
import { fetchJobs } from '../services/api'

function matchStyle(score) {
  if (score >= 80) return { bg: 'rgba(45,125,70,0.1)', color: '#2D7D46', border: 'rgba(45,125,70,0.25)' }
  if (score >= 65) return { bg: 'rgba(224,138,0,0.1)', color: '#E08A00', border: 'rgba(224,138,0,0.25)' }
  return { bg: 'rgba(220,38,38,0.08)', color: '#DC2626', border: 'rgba(220,38,38,0.2)' }
}

function Jobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('All')
  const [type, setType] = useState('All')
  const [minMatch, setMinMatch] = useState(0)

  const locations = ['All', 'Harare', 'Bulawayo', 'Remote']
  const types = ['All', 'Full-time', 'Remote', 'Contract']
  const matchFilters = [
    { label: 'All matches', value: 0 },
    { label: '80%+ Strong', value: 80 },
    { label: '65%+ Good', value: 65 },
  ]

  // Fetch from backend whenever filters change
  useEffect(() => {
    const timer = setTimeout(() => {
      loadJobs()
    }, 300) // debounce search by 300ms
    return () => clearTimeout(timer)
  }, [search, location, type, minMatch])

  async function loadJobs() {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchJobs({ search, location, type, minMatch })
      setJobs(data.jobs)
    } catch (err) {
      setError('Could not connect to the backend. Make sure uvicorn is running.')
    } finally {
      setLoading(false)
    }
  }

  const clearFilters = () => {
    setSearch('')
    setLocation('All')
    setType('All')
    setMinMatch(0)
  }

  const hasFilters = search || location !== 'All' || type !== 'All' || minMatch > 0

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F7F4', padding: '32px' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ color: '#1A1A2E', fontSize: '1.6rem', fontWeight: 'bold' }}>AI Job Matches</h2>
          <p style={{ color: '#9CA3AF', fontSize: '13px', marginTop: '4px' }}>
            {loading ? 'Loading...' : <><span style={{ color: '#E08A00', fontWeight: '600' }}>{jobs.length} matches</span> found for your profile</>}
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div style={{ backgroundColor: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: '10px', padding: '14px 18px', marginBottom: '20px', color: '#DC2626', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Search Bar */}
        <div style={{ position: 'relative', marginBottom: '16px' }}>
          <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', pointerEvents: 'none' }}>🔍</span>
          <input
            type="text"
            placeholder="Search by title, company or skill..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '12px 14px 12px 42px', borderRadius: '10px', border: '1px solid #E5E7EB', backgroundColor: '#fff', fontSize: '14px', color: '#1A1A2E', outline: 'none', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
            onFocus={e => e.target.style.borderColor = '#E08A00'}
            onBlur={e => e.target.style.borderColor = '#E5E7EB'}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#9CA3AF' }}>×</button>
          )}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            {locations.map(loc => (
              <button key={loc} onClick={() => setLocation(loc)} style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '500', cursor: 'pointer', border: '1px solid', backgroundColor: location === loc ? '#1A1A2E' : '#fff', color: location === loc ? '#fff' : '#6B7280', borderColor: location === loc ? '#1A1A2E' : '#E5E7EB', transition: 'all 0.15s' }}>
                {loc}
              </button>
            ))}
          </div>
          <div style={{ width: '1px', height: '24px', backgroundColor: '#E5E7EB' }} />
          <select value={type} onChange={e => setType(e.target.value)} style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #E5E7EB', backgroundColor: '#fff', fontSize: '13px', color: '#374151', cursor: 'pointer', outline: 'none' }}>
            {types.map(t => <option key={t}>{t}</option>)}
          </select>
          <select value={minMatch} onChange={e => setMinMatch(Number(e.target.value))} style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #E5E7EB', backgroundColor: '#fff', fontSize: '13px', color: '#374151', cursor: 'pointer', outline: 'none' }}>
            {matchFilters.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
          </select>
          {hasFilters && (
            <button onClick={clearFilters} style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '500', cursor: 'pointer', border: '1px solid #FCA5A5', backgroundColor: 'rgba(220,38,38,0.06)', color: '#DC2626' }}>
              Clear ×
            </button>
          )}
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {[1,2,3,4].map(i => (
              <div key={i} style={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '20px', height: '160px', animation: 'pulse 1.5s ease-in-out infinite' }}>
                <div style={{ backgroundColor: '#F3F4F6', borderRadius: '6px', height: '12px', width: '60%', marginBottom: '10px' }} />
                <div style={{ backgroundColor: '#F3F4F6', borderRadius: '6px', height: '16px', width: '80%', marginBottom: '16px' }} />
                <div style={{ display: 'flex', gap: '6px' }}>
                  {[1,2,3].map(j => <div key={j} style={{ backgroundColor: '#F3F4F6', borderRadius: '4px', height: '22px', width: '60px' }} />)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && jobs.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🔍</div>
            <p style={{ color: '#1A1A2E', fontWeight: 'bold', fontSize: '16px', marginBottom: '8px' }}>No jobs found</p>
            <p style={{ color: '#9CA3AF', fontSize: '14px', marginBottom: '16px' }}>Try adjusting your search or filters</p>
            <button onClick={clearFilters} style={{ backgroundColor: '#E08A00', color: '#fff', border: 'none', padding: '9px 20px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}>
              Clear all filters
            </button>
          </div>
        )}

        {/* Job Cards */}
        {!loading && !error && jobs.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {jobs.map(job => {
              const mc = matchStyle(job.match)
              return (
                <a key={job.id} href={`/jobs/${job.id}`} style={{ textDecoration: 'none' }}>
                  <div
                    style={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '20px', cursor: 'pointer', height: '100%', transition: 'all 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#E08A00'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(224,138,0,0.12)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div style={{ flex: 1, paddingRight: '12px' }}>
                        <p style={{ color: '#9CA3AF', fontSize: '12px' }}>{job.company}</p>
                        <h3 style={{ color: '#1A1A2E', fontWeight: 'bold', fontSize: '15px', marginTop: '4px', lineHeight: '1.3' }}>{job.title}</h3>
                      </div>
                      <span style={{ backgroundColor: mc.bg, color: mc.color, border: `1px solid ${mc.border}`, borderRadius: '20px', padding: '4px 10px', fontSize: '13px', fontWeight: 'bold', whiteSpace: 'nowrap', flexShrink: 0 }}>
                        {job.match}%
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '14px' }}>
                      {job.chips.map(chip => (
                        <span key={chip} style={{ backgroundColor: '#F3F4F6', border: '1px solid #E5E7EB', borderRadius: '5px', padding: '3px 8px', fontSize: '11px', color: '#6B7280' }}>{chip}</span>
                      ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #F3F4F6' }}>
                      <div>
                        <div style={{ color: '#E08A00', fontSize: '13px', fontWeight: '600' }}>{job.salary}</div>
                        <div style={{ color: '#9CA3AF', fontSize: '11px', marginTop: '2px' }}>{job.type} · 📍 {job.location}</div>
                      </div>
                      <span style={{ color: '#E08A00', fontSize: '13px', fontWeight: '500' }}>View →</span>
                    </div>
                  </div>
                </a>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Jobs
