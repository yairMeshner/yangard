import { useNavigate } from 'react-router-dom'
import { Shield, Eye, Brain, Bell } from 'lucide-react'

const FEATURES = [
  {
    icon: Eye,
    title: 'Silent Monitoring',
    desc: 'Keyspy runs invisibly in the background, capturing your child\'s activity without interrupting their day.',
  },
  {
    icon: Brain,
    title: 'AI-Powered Analysis',
    desc: 'Every session is analyzed by AI trained to detect bullying, self-harm, threats, and emotional distress.',
  },
  {
    icon: Bell,
    title: 'Instant Alerts',
    desc: 'Get severity-ranked alerts — HIGH, MEDIUM, and LOW — so you always know what needs attention first.',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    desc: 'You never see raw keystrokes. Only clean, clinical summaries reach the dashboard.',
  },
]

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#060d1f', color: '#fff', fontFamily: 'Inter, sans-serif' }}>

      {/* ── Nav ── */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 60px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        position: 'sticky', top: 0, zIndex: 10,
        backgroundColor: 'rgba(6,13,31,0.85)',
        backdropFilter: 'blur(12px)',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="30" height="34" viewBox="0 0 36 40" fill="none">
            <path d="M18 1L2 7.5V19C2 27.8 9.2 36.1 18 39C26.8 36.1 34 27.8 34 19V7.5L18 1Z" fill="#2563eb"/>
            <path d="M18 4L5 9.8V19C5 26.6 10.8 33.6 18 36.2V4Z" fill="#3b82f6" opacity="0.45"/>
            <path d="M11.5 19.5L15.5 23.5L24.5 14.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.03em' }}>Yangard</span>
        </div>

        {/* Auth buttons */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '9px 22px', borderRadius: '10px',
              border: '1px solid rgba(255,255,255,0.15)',
              background: 'transparent', color: '#cbd5e1',
              fontSize: '14px', fontWeight: 500, cursor: 'pointer',
              transition: 'border-color 150ms, color 150ms',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; e.currentTarget.style.color = '#fff' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = '#cbd5e1' }}
          >
            Log In
          </button>
          <button
            onClick={() => navigate('/register')}
            className="btn-gradient"
            style={{
              padding: '9px 22px', borderRadius: '10px', border: 'none',
              color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
              boxShadow: '0 2px 12px rgba(37,99,235,0.5)',
            }}
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ textAlign: 'center', padding: '100px 40px 80px' }}>
        {/* Glow */}
        <div style={{
          position: 'absolute', top: '120px', left: '50%', transform: 'translateX(-50%)',
          width: '600px', height: '300px', pointerEvents: 'none',
          background: 'radial-gradient(ellipse at center, rgba(37,99,235,0.25) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }} />

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '999px', border: '1px solid rgba(37,99,235,0.4)', backgroundColor: 'rgba(37,99,235,0.1)', marginBottom: '28px' }}>
          <Shield size={13} color="#60a5fa" />
          <span style={{ fontSize: '12px', color: '#60a5fa', fontWeight: 500 }}>AI-Powered Child Safety</span>
        </div>

        <h1 style={{
          fontSize: '64px', fontWeight: 800, lineHeight: 1.1,
          letterSpacing: '-0.04em', marginBottom: '24px',
          background: 'linear-gradient(135deg, #ffffff 30%, #60a5fa 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          Know what matters.<br />Before it's too late.
        </h1>

        <p style={{ fontSize: '18px', color: '#94a3b8', lineHeight: 1.7, maxWidth: '520px', margin: '0 auto 48px' }}>
          Yangard monitors your child's digital activity and uses AI to flag bullying, self-harm, and threats — so you can act before harm happens.
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <button
            onClick={() => navigate('/register')}
            className="btn-gradient"
            style={{
              padding: '15px 36px', borderRadius: '12px', border: 'none',
              color: '#fff', fontSize: '16px', fontWeight: 700, cursor: 'pointer',
              boxShadow: '0 4px 24px rgba(37,99,235,0.55)',
            }}
          >
            Get Started Free
          </button>
        </div>
      </section>

      {/* ── Feature cards ── */}
      <section style={{ padding: '40px 60px 120px', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <p style={{ fontSize: '12px', fontWeight: 600, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '14px' }}>
            How it works
          </p>
          <h2 style={{
            fontSize: '40px', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.15,
            background: 'linear-gradient(135deg, #ffffff 40%, #60a5fa 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            marginBottom: '16px',
          }}>
            Built for parents.<br />Powered by AI.
          </h2>
          <p style={{ fontSize: '16px', color: '#64748b', maxWidth: '440px', margin: '0 auto', lineHeight: 1.7 }}>
            Four layers of protection working silently in the background so you never miss a warning sign.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} style={{
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '24px', padding: '36px 32px',
              transition: 'border-color 200ms, background 200ms',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(37,99,235,0.5)'; e.currentTarget.style.background = 'rgba(37,99,235,0.07)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
            >
              <div style={{
                width: '52px', height: '52px', borderRadius: '14px',
                background: 'linear-gradient(135deg, #1e3a8a, #2563eb)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '20px',
                boxShadow: '0 4px 16px rgba(37,99,235,0.35)',
              }}>
                <Icon size={24} color="#93c5fd" />
              </div>
              <p style={{ fontSize: '17px', fontWeight: 700, color: '#f1f5f9', marginBottom: '10px', letterSpacing: '-0.01em' }}>{title}</p>
              <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.8 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
