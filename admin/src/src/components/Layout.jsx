import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { BarChart2, User, Download, LogOut } from 'lucide-react'
import { getName, clearSession } from '../api/session'

const NAV_ITEMS = [
  { label: 'Reports',          path: '/reports',  icon: BarChart2 },
  { label: "Child's Area",     path: '/child',    icon: User },
  { label: 'Download Keyspy',  path: '/download', icon: Download },
]

function ShieldLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <svg width="34" height="38" viewBox="0 0 36 40" fill="none">
        <path d="M18 1L2 7.5V19C2 27.8 9.2 36.1 18 39C26.8 36.1 34 27.8 34 19V7.5L18 1Z" fill="#2563eb"/>
        <path d="M18 4L5 9.8V19C5 26.6 10.8 33.6 18 36.2V4Z" fill="#3b82f6" opacity="0.45"/>
        <path d="M11.5 19.5L15.5 23.5L24.5 14.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <span style={{ fontSize: '17px', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.03em' }}>Yangard</span>
        <span style={{ fontSize: '9px', fontWeight: 500, color: '#475569', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '3px' }}>Child Safety</span>
      </div>
    </div>
  )
}

export default function Layout() {
  const navigate = useNavigate()

  function handleLogout() {
    clearSession()
    navigate('/')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: '240px',
        flexShrink: 0,
        backgroundColor: '#0f1f3d',
        display: 'flex',
        flexDirection: 'column',
        padding: '0',
      }}>

        {/* Logo */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <ShieldLogo />
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ fontSize: '10px', fontWeight: 600, color: '#334155', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0 12px', marginBottom: '8px', display: 'block' }}>
            Navigation
          </span>

          {NAV_ITEMS.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: isActive ? 500 : 400,
                color: isActive ? '#ffffff' : '#94a3b8',
                backgroundColor: isActive ? 'rgba(37,99,235,0.2)' : 'transparent',
                textDecoration: 'none',
                transition: 'all 150ms',
                border: isActive ? '1px solid rgba(37,99,235,0.3)' : '1px solid transparent',
              })}
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Account */}
        <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 12px', borderRadius: '10px',
            backgroundColor: 'rgba(255,255,255,0.04)',
          }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              backgroundColor: '#2563eb', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: '12px', fontWeight: 600, color: '#fff', flexShrink: 0,
            }}>{(getName() || 'P')[0].toUpperCase()}</div>
            <div>
              <p style={{ fontSize: '13px', fontWeight: 500, color: '#e2e8f0', lineHeight: 1.3 }}>{getName() || 'Parent'}</p>
              <p style={{ fontSize: '11px', color: '#475569', lineHeight: 1.3 }}>Account</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '9px 12px', borderRadius: '10px', border: 'none',
              backgroundColor: 'transparent', color: '#475569',
              fontSize: '13px', fontWeight: 500, cursor: 'pointer', width: '100%',
              transition: 'background 150ms, color 150ms',
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#f87171' }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#475569' }}
          >
            <LogOut size={14} /> Log Out
          </button>
        </div>

      </aside>

      {/* ── Main ── */}
      <main style={{ flex: 1, backgroundColor: '#f8fafc', padding: '36px 44px', overflowY: 'auto', position: 'relative' }}>

        {/* Background decoration */}
        <div style={{ position: 'fixed', inset: 0, left: '240px', pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
          {/* Top-right orb */}
          <div style={{
            position: 'absolute', top: '-120px', right: '-120px',
            width: '520px', height: '520px',
            background: 'radial-gradient(ellipse, rgba(37,99,235,0.12) 0%, transparent 65%)',
            borderRadius: '50%',
          }} />
          {/* Bottom-left orb */}
          <div style={{
            position: 'absolute', bottom: '-140px', left: '-60px',
            width: '480px', height: '480px',
            background: 'radial-gradient(ellipse, rgba(96,165,250,0.09) 0%, transparent 65%)',
            borderRadius: '50%',
          }} />
          {/* Top-left shield */}
          <svg width="180" height="200" viewBox="0 0 36 40" fill="none" style={{ position: 'absolute', top: '40px', left: '24px', opacity: 0.04 }}>
            <path d="M18 1L2 7.5V19C2 27.8 9.2 36.1 18 39C26.8 36.1 34 27.8 34 19V7.5L18 1Z" fill="#2563eb"/>
          </svg>
          {/* Bottom-right shield */}
          <svg width="260" height="290" viewBox="0 0 36 40" fill="none" style={{ position: 'absolute', bottom: '20px', right: '20px', opacity: 0.035 }}>
            <path d="M18 1L2 7.5V19C2 27.8 9.2 36.1 18 39C26.8 36.1 34 27.8 34 19V7.5L18 1Z" fill="#2563eb"/>
          </svg>
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <Outlet />
        </div>
      </main>

    </div>
  )
}
