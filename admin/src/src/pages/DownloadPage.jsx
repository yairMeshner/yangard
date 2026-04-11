import { useState } from 'react'
import { Download } from 'lucide-react'
import toast from 'react-hot-toast'
import { downloadKeyspy } from '../api/client'
import { getSession } from '../api/session'

const C = {
  blue:      '#2563eb',
  bluePale:  '#eff6ff',
  blueTint:  '#dbeafe',
  text:      '#111827',
  textSub:   '#374151',
  textMuted: '#6b7280',
  border:    '#e4e7ec',
  card:      '#ffffff',
}

function KeyspyLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <svg width="56" height="62" viewBox="0 0 36 40" fill="none">
        <path d="M18 1L2 7.5V19C2 27.8 9.2 36.1 18 39C26.8 36.1 34 27.8 34 19V7.5L18 1Z" fill="#2563eb"/>
        <path d="M18 4L5 9.8V19C5 26.6 10.8 33.6 18 36.2V4Z" fill="#3b82f6" opacity="0.45"/>
        <path d="M11.5 19.5L15.5 23.5L24.5 14.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
        <span style={{ fontSize: '26px', fontWeight: 700, color: C.text, letterSpacing: '-0.03em' }}>Keyspy</span>
        <span style={{ fontSize: '12px', color: C.textMuted, fontWeight: 500, letterSpacing: '0.04em' }}>by Yangard</span>
      </div>
    </div>
  )
}

export default function DownloadPage() {
  const [loading, setLoading] = useState(false)

  function handleDownload() {
    setLoading(true)
    downloadKeyspy()
      .then(r => {
        const url = window.URL.createObjectURL(new Blob([r.data]))
        const a = document.createElement('a')
        a.href = url
        a.download = `keyspy_${getSession()}.exe`
        a.click()
        window.URL.revokeObjectURL(url)
        toast.success('Download started')
      })
      .catch((e) => toast.error(e.isNetworkError ? 'Service unavailable — try again later' : 'Download failed'))
      .finally(() => setLoading(false))
  }
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>

      {/* Page header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
          <span style={{ fontSize: '12px', color: C.textMuted }}>Dashboard</span>
          <span style={{ color: C.border }}>/</span>
          <span style={{ fontSize: '12px', color: C.textSub, fontWeight: 500 }}>Download Keyspy</span>
        </div>
        <h1 style={{ fontSize: '26px', fontWeight: 700, color: C.text, letterSpacing: '-0.02em' }}>Download Keyspy</h1>
        <p style={{ fontSize: '14px', color: C.textMuted, marginTop: '4px' }}>Install the monitoring client on your child's computer</p>
      </div>

      {/* Card */}
      <div style={{
        backgroundColor: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '28px',
        textAlign: 'center',
      }}>
        <KeyspyLogo />

        <div>
          <p style={{ fontSize: '14px', color: C.textSub, lineHeight: 1.7, maxWidth: '380px' }}>
            Keyspy runs silently in the background and captures your child's activity.
            All data is sent securely to Yangard for AI analysis — parents never see raw keystrokes.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', maxWidth: '260px' }}>
          <button
            onClick={handleDownload}
            disabled={loading}
            className={!loading ? 'btn-gradient' : ''}
            style={{
              width: '100%',
              padding: '12px 28px',
              borderRadius: '10px',
              border: 'none',
              background: loading ? '#e4e7ec' : undefined,
              color: loading ? '#6b7280' : '#fff',
              fontSize: '14px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              boxShadow: loading ? 'none' : '0 2px 8px rgba(37,99,235,0.35)',
            }}
          >
            <Download size={16} />
            {loading ? 'Building...' : 'Download for Windows'}
          </button>
          <span style={{ fontSize: '11px', color: C.textMuted }}>Windows 10 / 11 · v1.0.0</span>
        </div>
      </div>

    </div>
  )
}
