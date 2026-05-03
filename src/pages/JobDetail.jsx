import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { fetchJob, fetchAIMatch } from '../services/api'

function ScoreBar({ label, value }) {
  const color = value >= 80 ? '#2D7D46' : value >= 60 ? '#E08A00' : '#DC2626'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
      <span style={{ color: '#9CA3AF', fontSize: '12px', width: '80px', flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1, height: '6px', backgroundColor: '#F3F4F6', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{ width: `${value}%`, height: '100%', backgroundColor: color, borderRadius: '3px', transition: 'width 0.8s ease' }} />
      </div>
      <span style={{ color, fontSize: '12px', fontWeight: '600', width: '28px', textAlign: 'right' }}>{value}</span>
    </div>
  )
}

function JobDetail() {
  const { id } = useParams()
  const [job, setJob] = useState(null)
  const [aiMatch, setAiMatch] = useState(null)
  const [loadingJob, setLoadingJob] = useState(true)
  const [loadingAI, setLoadingAI] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadJob() {
      try {
        setLoadingJob(true)
        const data = await fetchJob(id)
        setJob(data)
      } catch (err) {
        setError('Could not load this job. Make sure uvicorn is running.')
      } finally {
        setLoadingJob(false)
      }
    }
    loadJob()
  }, [id])

  async function runAIMatch() {
    try {
      setLoadingAI(true)
      setAiMatch(null)
      const data = await fetchAIMatch(id)
      setAiMatch(data)
    } catch (err) {
      setError('AI match failed. Check your Gemini API key in .env')
    } finally {
      setLoadingAI(false)
    }
  }

  if (loadingJob) return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F7F4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#9CA3AF' }}>Loading job...</p>
    </div>
  )

  if (error && !job) return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F7F4', padding: '32px' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto', backgroundColor: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: '12px', padding: '24px', color: '#DC2626' }}>
        <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>⚠️ {error}</p>
        <a href="/jobs" style={{ color: '#E08A00', fontSize: '14px' }}>← Back to Jobs</a>
      </div>
    </div>
  )

  // Use AI match data if available, otherwise fall back to static data
  const display = aiMatch || job
  const sections = display.strengths ? [
    { label: '✓ Your Strengths', color: '#2D7D46', bg: 'rgba(45,125,70,0.06)', border: 'rgba(45,125,70,0.15)', items: display.strengths },
    { label: '△ Skill Gaps', color: '#DC2626', bg: 'rgba(220,38,38,0.05)', border: 'rgba(220,38,38,0.15)', items: display.gaps },
    { label: '★ Application Tips', color: '#E08A00', bg: 'rgba(224,138,0,0.06)', border: 'rgba(224,138,0,0.15)', items: display.tips },
  ] : []

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F7F4', padding: '32px' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>

        {/* Job Header */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ color: '#1A1A2E', fontSize: '1.6rem', fontWeight: 'bold', lineHeight: '1.3' }}>{job.title}</h1>
          <p style={{ color: '#E08A00', marginTop: '6px', fontSize: '15px', fontWeight: '500' }}>{job.company} · 📍 {job.location}</p>
          <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
            <span style={{ backgroundColor: '#F3F4F6', border: '1px solid #E5E7EB', borderRadius: '5px', padding: '3px 8px', fontSize: '12px', color: '#6B7280' }}>{job.type}</span>
            <span style={{ backgroundColor: '#F3F4F6', border: '1px solid #E5E7EB', borderRadius: '5px', padding: '3px 8px', fontSize: '12px', color: '#6B7280' }}>{job.salary}</span>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div style={{ backgroundColor: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', color: '#DC2626', fontSize: '14px' }}>
            ⚠️ {error}
          </div>
        )}

        {/* Match Score Card */}
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '24px', textAlign: 'center', marginBottom: '16px', border: '1px solid #E5E7EB', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '4rem', fontWeight: 'bold', color: '#E08A00', lineHeight: '1' }}>
            {display.match}%
          </div>
          <div style={{ color: '#9CA3AF', fontSize: '13px', marginTop: '4px', marginBottom: '4px' }}>
            {aiMatch ? '🤖 AI-Generated Match Score' : 'Match Score'}
          </div>
          {aiMatch && (
            <div style={{ display: 'inline-block', backgroundColor: 'rgba(45,125,70,0.1)', color: '#2D7D46', border: '1px solid rgba(45,125,70,0.2)', borderRadius: '20px', padding: '3px 12px', fontSize: '12px', fontWeight: '500', marginBottom: '16px' }}>
              ✦ Powered by Gemini AI
            </div>
          )}
          {!aiMatch && <div style={{ marginBottom: '16px' }} />}

          {display.scores && (
            <>
              <ScoreBar label="Skills" value={display.scores.skills} />
              <ScoreBar label="Experience" value={display.scores.experience} />
              <ScoreBar label="Culture" value={display.scores.culture} />
              <ScoreBar label="Growth" value={display.scores.growth} />
            </>
          )}

          {/* AI Match Button */}
          <button
            onClick={runAIMatch}
            disabled={loadingAI}
            style={{
              marginTop: '16px', width: '100%', backgroundColor: loadingAI ? '#F3F4F6' : '#1A1A2E',
              color: loadingAI ? '#9CA3AF' : '#fff', border: 'none', borderRadius: '8px',
              padding: '11px', fontSize: '14px', fontWeight: '600', cursor: loadingAI ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {loadingAI ? '🤖 Gemini is analysing your profile...' : aiMatch ? '🔄 Re-run AI Match' : '✦ Run AI Match Analysis'}
          </button>
        </div>

        {/* AI Feedback Sections */}
        {sections.map(section => (
          <div key={section.label} style={{ backgroundColor: section.bg, borderRadius: '12px', padding: '20px', marginBottom: '14px', border: `1px solid ${section.border}` }}>
            <h3 style={{ color: section.color, fontWeight: 'bold', marginBottom: '12px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {section.label}
            </h3>
            {section.items.map((item, i) => (
              <p key={i} style={{ color: '#374151', fontSize: '14px', marginBottom: '8px', lineHeight: '1.6', display: 'flex', gap: '8px' }}>
                <span style={{ color: section.color, flexShrink: 0 }}>•</span>{item}
              </p>
            ))}
          </div>
        ))}

        {/* Prompt to run AI if not done yet */}
        {!aiMatch && !loadingAI && (
          <div style={{ backgroundColor: 'rgba(224,138,0,0.06)', border: '1px solid rgba(224,138,0,0.2)', borderRadius: '12px', padding: '20px', marginBottom: '14px', textAlign: 'center' }}>
            <p style={{ color: '#92400E', fontSize: '14px', marginBottom: '4px', fontWeight: '600' }}>✦ AI Analysis Ready</p>
            <p style={{ color: '#B45309', fontSize: '13px' }}>Click "Run AI Match Analysis" above to get real AI-powered feedback on this job</p>
          </div>
        )}

        {/* Apply Button */}
        <button
          style={{ width: '100%', backgroundColor: '#2D7D46', color: '#fff', border: 'none', borderRadius: '10px', padding: '15px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', marginTop: '8px', boxShadow: '0 4px 14px rgba(45,125,70,0.25)' }}
          onClick={() => alert(`Application sent to ${job.company}!`)}
        >
          Apply to {job.company} →
        </button>

      </div>
    </div>
  )
}

export default JobDetail
