import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import toast from 'react-hot-toast'
import { AlertTriangle, MessageCircleWarning, Info, User } from 'lucide-react'
import { getReport, getChild } from '../api/client'


// ── Design tokens ──────────────────────────────────────────
const C = {
  blue:        '#2563eb',
  bluePale:    '#eff6ff',
  blueTint:    '#dbeafe',
  text:        '#111827',
  textSub:     '#374151',
  textMuted:   '#6b7280',
  border:      '#e4e7ec',
  card:        '#ffffff',
  orangeStrong:'#f97316',
  orangePale:  '#fff7ed',
  orangeBorder:'#fed7aa',
  amberStrong: '#f59e0b',
  amberPale:   '#fffbeb',
  amberBorder: '#fde68a',
  greenStrong: '#64748b',
  greenPale:   '#f8fafc',
  greenBorder: '#e2e8f0',
}

const SEVERITY = {
  HIGH:   { color: C.orangeStrong, pale: C.orangePale, border: C.orangeBorder, Icon: AlertTriangle,        label: 'High',   text: '#9a3412' },
  MEDIUM: { color: C.amberStrong,  pale: C.amberPale,  border: C.amberBorder,  Icon: MessageCircleWarning, label: 'Medium', text: '#92400e' },
  LOW:    { color: C.greenStrong,  pale: C.greenPale,  border: C.greenBorder,  Icon: Info,                 label: 'Low',    text: '#475569' },
}

// ── Sub-components ─────────────────────────────────────────

function SeverityBadge({ level }) {
  const s = SEVERITY[level]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      padding: '3px 10px', borderRadius: '999px',
      backgroundColor: s.pale, border: `1px solid ${s.border}`,
      fontSize: '11px', fontWeight: 600, color: s.color,
      letterSpacing: '0.04em', textTransform: 'uppercase',
    }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: s.color, display: 'inline-block' }} />
      {s.label}
    </span>
  )
}

function AlertCard({ alert }) {
  const s = SEVERITY[alert.severity]
  const Icon = s.Icon
  const isHigh = alert.severity === 'HIGH'

  return (
    <div
      style={{
        backgroundColor: C.card,
        border: `1px solid ${s.border}`,
        borderTop: `3px solid ${s.color}`,
        borderRadius: '16px',
        padding: '20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        transition: 'box-shadow 200ms',
        display: 'flex', flexDirection: 'column', gap: '12px',
      }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)'}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%',
            backgroundColor: s.pale, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            ...(isHigh ? { animation: 'pulse-border 2s ease-in-out infinite' } : {})
          }}>
            <Icon size={15} color={s.color} />
          </div>
          <SeverityBadge level={alert.severity} />
        </div>
        <span style={{ fontSize: '11px', color: C.textMuted }}>{alert.time}</span>
      </div>

      {/* Title + summary */}
      <div>
        <p style={{ fontSize: '14px', fontWeight: 600, color: C.text, marginBottom: '5px', lineHeight: 1.4 }}>{alert.title}</p>
        <p style={{ fontSize: '13px', color: C.textMuted, lineHeight: 1.6 }}>{alert.summary}</p>
      </div>

      {/* Sources */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {alert.sources.map(src => (
          <span key={src} style={{ fontSize: '11px', fontWeight: 500, color: C.blue, backgroundColor: C.bluePale, border: `1px solid ${C.blueTint}`, padding: '2px 8px', borderRadius: '6px' }}>
            {src}
          </span>
        ))}
      </div>

    </div>
  )
}

function StatPill({ label, value, type }) {
  const bg    = type === 'alert' ? C.orangePale  : type === 'safe' ? C.greenPale  : '#f8fafc'
  const bdr   = type === 'alert' ? C.orangeBorder : type === 'safe' ? C.greenBorder : C.border
  const color = type === 'alert' ? '#ea580c'      : type === 'safe' ? C.greenStrong  : C.text
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 20px', borderRadius: '12px', backgroundColor: bg, border: `1px solid ${bdr}` }}>
      <span style={{ fontSize: '18px', fontWeight: 700, color, lineHeight: 1 }}>{value}</span>
      <span style={{ fontSize: '11px', color: C.textMuted, fontWeight: 500, marginTop: '3px' }}>{label}</span>
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────

export default function ReportsPage() {
  const navigate = useNavigate()
  const [from, setFrom] = useState('')
  const [to, setTo]     = useState('')
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState(null)
  const [profileLoaded, setProfileLoaded] = useState(false)
  const [report, setReport]   = useState(null)

  useEffect(() => {
    getChild()
      .then(r => { if (r.data.status === 'ok') setProfile(r.data.child) })
      .finally(() => setProfileLoaded(true))
  }, [])

  const datesInvalid = from && to && dayjs(from).isAfter(dayjs(to))
  const isValid = from && to && !datesInvalid

  function handleSubmit() {
    setLoading(true)
    setReport(null)
    getReport(from, to)
      .then(r => {
        setReport({
          eventCount: r.data.event_count,
          overall_summary: r.data.overall_summary,
          alerts: r.data.alerts,
        })
        toast.success('Report loaded')
      })
      .catch(() => toast.error('Failed to load report'))
      .finally(() => setLoading(false))
  }

  const inputStyle = {
    backgroundColor: C.card,
    border: `1px solid ${C.border}`,
    borderRadius: '10px',
    padding: '10px 14px',
    fontSize: '14px',
    color: C.textSub,
    outline: 'none',
    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
    cursor: 'pointer',
  }

  const highAlerts   = report?.alerts?.filter(a => a.severity === 'HIGH')   ?? []
  const mediumAlerts = report?.alerts?.filter(a => a.severity === 'MEDIUM') ?? []
  const lowAlerts    = report?.alerts?.filter(a => a.severity === 'LOW')    ?? []

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>

      {/* ── Page header ── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
          <span style={{ fontSize: '12px', color: C.textMuted }}>Dashboard</span>
          <span style={{ color: C.border }}>/</span>
          <span style={{ fontSize: '12px', color: C.textSub, fontWeight: 500 }}>Reports</span>
        </div>
        <h1 style={{ fontSize: '26px', fontWeight: 700, color: C.text, letterSpacing: '-0.02em' }}>Activity Reports</h1>
        <p style={{ fontSize: '14px', color: C.textMuted, marginTop: '4px' }}>AI-analyzed activity — select a date range to load a report</p>
      </div>

      {/* ── Child info strip ── */}
      {profile && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '20px',
          padding: '16px 20px', borderRadius: '16px',
          backgroundColor: C.card, border: `1px solid ${C.border}`,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)', flexWrap: 'wrap',
        }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 700, color: '#1d4ed8', flexShrink: 0 }}>
            {profile.name?.[0]}
          </div>
          <div>
            <p style={{ fontSize: '15px', fontWeight: 600, color: C.text }}>{profile.name}</p>
            <p style={{ fontSize: '13px', color: C.textMuted }}>{profile.gender} · Born {profile.year_of_birth}{profile.mental_considerations ? ` · ${profile.mental_considerations}` : ''}</p>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginLeft: 'auto', flexWrap: 'wrap' }}>
            <StatPill label="Total Events" value={report?.eventCount ?? '—'} />
            <StatPill label="Alerts" value={report?.alerts?.length ?? '—'} type="alert" />
            <StatPill label="High Severity" value={highAlerts.length} type="alert" />
          </div>
        </div>
      )}

      {/* ── No child warning / date filter ── */}
      {profileLoaded && !profile ? (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '20px',
          padding: '24px 28px', borderRadius: '16px',
          backgroundColor: C.bluePale, border: `1px solid ${C.blueTint}`,
        }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <User size={22} color="#1d4ed8" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '15px', fontWeight: 600, color: C.text, marginBottom: '4px' }}>Set up your child's profile first</p>
            <p style={{ fontSize: '13px', color: C.textMuted }}>Before generating reports, you need to enter your child's information so the AI can analyze their activity accurately.</p>
          </div>
          <button
            onClick={() => navigate('/child')}
            className="btn-gradient"
            style={{
              padding: '10px 22px', borderRadius: '10px', border: 'none',
              color: '#fff', fontSize: '14px', fontWeight: 600,
              cursor: 'pointer', flexShrink: 0,
              boxShadow: '0 2px 8px rgba(37,99,235,0.35)',
            }}
          >
            Go to Child's Area
          </button>
        </div>
      ) : profile && (
        <div style={{
          padding: '2px', borderRadius: '18px',
          background: 'linear-gradient(135deg, #2563eb, #60a5fa, #2563eb)',
          boxShadow: '0 4px 24px rgba(37,99,235,0.2), 0 1px 4px rgba(37,99,235,0.1)',
        }}>
          <div style={{
            display: 'flex', alignItems: 'flex-end', gap: '12px', flexWrap: 'wrap',
            padding: '20px 24px', borderRadius: '16px', backgroundColor: C.card,
          }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, color: C.blue, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '6px' }}>From</label>
              <input type="date" value={from} onChange={e => setFrom(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, color: C.blue, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '6px' }}>To</label>
              <input type="date" value={to} onChange={e => setTo(e.target.value)} style={inputStyle} />
            </div>
            <button
              onClick={handleSubmit}
              disabled={!isValid || loading}
              className={isValid && !loading ? 'btn-gradient' : ''}
              style={{
                padding: '10px 28px', borderRadius: '10px', border: 'none',
                background: isValid && !loading ? undefined : '#e4e7ec',
                color: isValid && !loading ? '#fff' : C.textMuted,
                fontSize: '14px', fontWeight: 600,
                cursor: isValid && !loading ? 'pointer' : 'not-allowed',
                boxShadow: isValid && !loading ? '0 2px 8px rgba(37,99,235,0.35)' : 'none',
              }}
            >
              {loading ? 'Loading...' : 'Generate Report'}
            </button>
            {datesInvalid && <p style={{ fontSize: '12px', color: '#ef4444', alignSelf: 'center' }}>"From" cannot be after "To"</p>}
          </div>
        </div>
      )}

      {/* ── Report ── */}
      {report && (
        <>
          {/* Overall summary */}
          <div style={{ padding: '20px 24px', borderRadius: '16px', backgroundColor: C.bluePale, border: `1px solid ${C.blueTint}` }}>
            <p style={{ fontSize: '12px', fontWeight: 600, color: C.blue, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>AI Overall Summary</p>
            <p style={{ fontSize: '14px', color: C.textSub, lineHeight: 1.7 }}>{report.overall_summary}</p>
          </div>

          {/* HIGH alerts */}
          {highAlerts.length > 0 && (
            <div>
              <h2 style={{ fontSize: '15px', fontWeight: 600, color: C.orangeStrong, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertTriangle size={16} /> High Severity ({highAlerts.length})
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
                {highAlerts.map(alert => <AlertCard key={alert.id} alert={alert} />)}
              </div>
            </div>
          )}

          {/* MEDIUM alerts */}
          {mediumAlerts.length > 0 && (
            <div>
              <h2 style={{ fontSize: '15px', fontWeight: 600, color: C.amberStrong, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MessageCircleWarning size={16} /> Medium Severity ({mediumAlerts.length})
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
                {mediumAlerts.map(alert => <AlertCard key={alert.id} alert={alert} />)}
              </div>
            </div>
          )}

          {/* LOW alerts */}
          {lowAlerts.length > 0 && (
            <div>
              <h2 style={{ fontSize: '15px', fontWeight: 600, color: C.greenStrong, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Info size={16} /> Low Severity ({lowAlerts.length})
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
                {lowAlerts.map(alert => <AlertCard key={alert.id} alert={alert} />)}
              </div>
            </div>
          )}
        </>
      )}

    </div>
  )
}
