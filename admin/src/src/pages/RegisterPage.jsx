import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Shield, Mail, Lock, User, ArrowRight } from 'lucide-react'
import { register, setSession } from '../api/client'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.name || !form.email || !form.password || !form.confirm) {
      toast.error('Please fill in all fields')
      return
    }
    if (form.password !== form.confirm) {
      toast.error('Passwords do not match')
      return
    }
    setLoading(true)
    register(form.name, form.email, form.password)
      .then(r => {
        if (r.data.status === 'error') {
          toast.error(r.data.message)
          return
        }
        setSession(r.data.uuid, r.data.name)
        navigate('/reports')
      })
      .catch((e) => toast.error(e.isNetworkError ? 'Service unavailable — try again later' : 'Registration failed'))
      .finally(() => setLoading(false))
  }

  return (
    <div style={{
      minHeight: '100vh', backgroundColor: '#060d1f',
      display: 'flex', fontFamily: 'Inter, sans-serif',
    }}>

      {/* ── Left decorative panel ── */}
      <div style={{
        width: '420px', flexShrink: 0,
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '60px 48px',
        background: 'linear-gradient(160deg, #0f1f3d 0%, #060d1f 100%)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', bottom: '10%', right: '-10%',
          width: '300px', height: '300px', pointerEvents: 'none',
          background: 'radial-gradient(ellipse, rgba(37,99,235,0.2) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }} />

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '999px', border: '1px solid rgba(37,99,235,0.35)', backgroundColor: 'rgba(37,99,235,0.1)', marginBottom: '32px', width: 'fit-content' }}>
          <Shield size={12} color="#60a5fa" />
          <span style={{ fontSize: '11px', color: '#60a5fa', fontWeight: 600, letterSpacing: '0.05em' }}>START FOR FREE</span>
        </div>

        <h2 style={{ fontSize: '26px', fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.02em', lineHeight: 1.3, marginBottom: '16px' }}>
          Set up takes<br />less than 2 minutes.
        </h2>
        <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.7, marginBottom: '48px' }}>
          Create your account, install Keyspy on your child's device, and you're protected.
        </p>

        {['Create your parent account', 'Download & install Keyspy', 'Start receiving AI reports'].map((step, i) => (
          <div key={step} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '24px' }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, #1e3a8a, #2563eb)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '12px', fontWeight: 700, color: '#fff',
              boxShadow: '0 2px 10px rgba(37,99,235,0.4)',
            }}>
              {i + 1}
            </div>
            <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.6, paddingTop: '4px' }}>{step}</p>
          </div>
        ))}
      </div>

      {/* ── Right form panel ── */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        padding: '60px',
        background: 'linear-gradient(160deg, #0a1628 0%, #060d1f 60%)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '15%', right: '20%',
          width: '400px', height: '400px', pointerEvents: 'none',
          background: 'radial-gradient(ellipse, rgba(37,99,235,0.15) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }} />

        <div style={{ position: 'relative', maxWidth: '400px', width: '100%' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '48px', textDecoration: 'none' }}>
            <svg width="30" height="34" viewBox="0 0 36 40" fill="none">
              <path d="M18 1L2 7.5V19C2 27.8 9.2 36.1 18 39C26.8 36.1 34 27.8 34 19V7.5L18 1Z" fill="#2563eb"/>
              <path d="M18 4L5 9.8V19C5 26.6 10.8 33.6 18 36.2V4Z" fill="#3b82f6" opacity="0.45"/>
              <path d="M11.5 19.5L15.5 23.5L24.5 14.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ fontSize: '18px', fontWeight: 700, color: '#fff', letterSpacing: '-0.03em' }}>Yangard</span>
          </Link>

          <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.2, marginBottom: '10px' }}>
            Create your account
          </h1>
          <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '36px' }}>
            Start protecting your child today.
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <Field icon={User} label="Full Name" name="name" type="text" value={form.name} onChange={handleChange} placeholder="Jane Smith" />
            <Field icon={Mail} label="Email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
            <Field icon={Lock} label="Password" name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" />
            <Field icon={Lock} label="Confirm Password" name="confirm" type="password" value={form.confirm} onChange={handleChange} placeholder="••••••••" />

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
              {loading ? 'Creating account...' : (<>Create Account <ArrowRight size={16} /></>)}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#475569' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#60a5fa', fontWeight: 500, textDecoration: 'none' }}>Log in</Link>
          </p>
        </div>
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
