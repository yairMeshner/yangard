import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Shield, Mail, Lock, ArrowRight } from 'lucide-react'
import { login, setSession } from '../api/client'

export default function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.email || !form.password) {
      toast.error('Please fill in all fields')
      return
    }
    setLoading(true)
    login(form.email, form.password)
      .then(r => {
        if (r.data.status === 'error') {
          toast.error(r.data.message)
          return
        }
        setSession(r.data.uuid, r.data.name)
        navigate('/reports')
      })
      .catch((e) => toast.error(e.isNetworkError ? 'Service unavailable — try again later' : 'Login failed'))
      .finally(() => setLoading(false))
  }

  return (
    <div style={{
      minHeight: '100vh', backgroundColor: '#060d1f',
      display: 'flex', fontFamily: 'Inter, sans-serif',
    }}>

      {/* ── Left panel ── */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        padding: '60px',
        background: 'linear-gradient(160deg, #0a1628 0%, #060d1f 60%)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Background glow */}
        <div style={{
          position: 'absolute', top: '20%', left: '30%',
          width: '400px', height: '400px', pointerEvents: 'none',
          background: 'radial-gradient(ellipse, rgba(37,99,235,0.18) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }} />

        <div style={{ position: 'relative', maxWidth: '380px', width: '100%' }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '60px', textDecoration: 'none' }}>
            <svg width="30" height="34" viewBox="0 0 36 40" fill="none">
              <path d="M18 1L2 7.5V19C2 27.8 9.2 36.1 18 39C26.8 36.1 34 27.8 34 19V7.5L18 1Z" fill="#2563eb"/>
              <path d="M18 4L5 9.8V19C5 26.6 10.8 33.6 18 36.2V4Z" fill="#3b82f6" opacity="0.45"/>
              <path d="M11.5 19.5L15.5 23.5L24.5 14.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ fontSize: '18px', fontWeight: 700, color: '#fff', letterSpacing: '-0.03em' }}>Yangard</span>
          </Link>

          <h1 style={{ fontSize: '36px', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '12px' }}>
            Welcome back
          </h1>
          <p style={{ fontSize: '15px', color: '#64748b', marginBottom: '40px', lineHeight: 1.6 }}>
            Log in to view your child's activity reports and alerts.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Field icon={Mail} label="Email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
            <Field icon={Lock} label="Password" name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" />

            <button
              type="submit"
              disabled={loading}
              className={!loading ? 'btn-gradient' : ''}
              style={{
                marginTop: '8px', padding: '13px', borderRadius: '12px', border: 'none',
                background: loading ? '#1e3a5f' : undefined,
                color: '#fff', fontSize: '15px', fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                boxShadow: loading ? 'none' : '0 4px 20px rgba(37,99,235,0.5)',
              }}
            >
              {loading ? 'Logging in...' : (<>Log In <ArrowRight size={16} /></>)}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '28px', fontSize: '14px', color: '#475569' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#60a5fa', fontWeight: 500, textDecoration: 'none' }}>Sign up</Link>
          </p>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div style={{
        width: '420px', flexShrink: 0,
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '60px 48px',
        background: 'linear-gradient(160deg, #0f1f3d 0%, #060d1f 100%)',
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '999px', border: '1px solid rgba(37,99,235,0.35)', backgroundColor: 'rgba(37,99,235,0.1)', marginBottom: '32px', width: 'fit-content' }}>
          <Shield size={12} color="#60a5fa" />
          <span style={{ fontSize: '11px', color: '#60a5fa', fontWeight: 600, letterSpacing: '0.05em' }}>TRUSTED BY PARENTS</span>
        </div>

        <h2 style={{ fontSize: '26px', fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.02em', lineHeight: 1.3, marginBottom: '40px' }}>
          Everything you need<br />to keep them safe.
        </h2>

        {[
          { title: 'Real-time AI analysis', desc: 'Every keystroke is analyzed for risk the moment it\'s captured.' },
          { title: 'Severity-ranked alerts', desc: 'HIGH, MEDIUM, and LOW — so you focus on what matters most.' },
          { title: 'Complete privacy', desc: 'You see summaries, never raw text. Your child\'s dignity is protected.' },
        ].map(item => (
          <div key={item.title} style={{ display: 'flex', gap: '14px', marginBottom: '28px' }}>
            <div style={{
              width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2563eb',
              marginTop: '6px', flexShrink: 0,
              boxShadow: '0 0 8px rgba(37,99,235,0.8)',
            }} />
            <div>
              <p style={{ fontSize: '14px', fontWeight: 600, color: '#e2e8f0', marginBottom: '4px' }}>{item.title}</p>
              <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

function Field({ icon: Icon, label, name, type, value, onChange, placeholder }) {
  const [focused, setFocused] = useState(false)
  return (
    <div>
      <label style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '8px' }}>
        {label}
      </label>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '12px 14px', borderRadius: '12px',
        border: `1px solid ${focused ? '#2563eb' : 'rgba(255,255,255,0.1)'}`,
        backgroundColor: 'rgba(255,255,255,0.04)',
        boxShadow: focused ? '0 0 0 3px rgba(37,99,235,0.2)' : 'none',
        transition: 'border-color 150ms, box-shadow 150ms',
      }}>
        <Icon size={16} color={focused ? '#60a5fa' : '#475569'} style={{ flexShrink: 0 }} />
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: 1, background: 'none', border: 'none', outline: 'none',
            fontSize: '14px', color: '#f1f5f9',
          }}
        />
      </div>
    </div>
  )
}
