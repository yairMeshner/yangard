import { useState, useEffect } from 'react'
import { Pencil } from 'lucide-react'
import toast from 'react-hot-toast'
import { getChild, createChild, updateChild } from '../api/client'

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

const GENDERS = ['Male', 'Female', 'Other']
const CURRENT_YEAR = new Date().getFullYear()

function Input({ name, type = 'text', placeholder, disabled, value, onChange }) {
  return (
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      style={{
        width: '100%', padding: '10px 14px', borderRadius: '10px',
        border: `1px solid ${!disabled ? C.blue : C.border}`,
        fontSize: '14px', color: disabled ? C.textMuted : C.textSub,
        backgroundColor: disabled ? '#f8fafc' : C.card,
        outline: 'none', cursor: disabled ? 'not-allowed' : 'text',
        boxSizing: 'border-box',
        boxShadow: !disabled ? `0 0 0 3px ${C.blueTint}` : 'none',
      }}
    />
  )
}

export default function ChildAreaPage() {
  const [child, setChild]     = useState(null)
  const [loaded, setLoaded]   = useState(false)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving]   = useState(false)
  const [form, setForm]       = useState({ name: '', year_of_birth: '', gender: '', mental_considerations: '' })

  useEffect(() => {
    getChild()
      .then(r => {
        if (r.data.status === 'ok') {
          setChild(r.data.child)
          setForm({
            name: r.data.child.name,
            year_of_birth: r.data.child.year_of_birth,
            gender: r.data.child.gender,
            mental_considerations: r.data.child.mental_considerations ?? '',
          })
        }
      })
      .catch((e) => toast.error(e.isNetworkError ? 'Service unavailable — try again later' : 'Failed to load child info'))
      .finally(() => setLoaded(true))
  }, [])

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  function handleSave() {
    if (!form.name || !form.year_of_birth || !form.gender) {
      toast.error('Please fill in name, year of birth, and gender')
      return
    }
    const payload = {
      name: form.name,
      year_of_birth: parseInt(form.year_of_birth),
      gender: form.gender,
      mental_considerations: form.mental_considerations || null,
    }
    setSaving(true)
    const call = child ? updateChild(payload) : createChild(payload)
    call
      .then(r => {
        if (r.data.status === 'error') { toast.error(r.data.message); return }
        setChild(payload)
        setEditing(false)
        toast.success(child ? 'Changes saved' : 'Child profile created')
      })
      .catch((e) => toast.error(e.isNetworkError ? 'Service unavailable — try again later' : 'Failed to save'))
      .finally(() => setSaving(false))
  }

  const isEditing = editing || !child
  const age = child ? CURRENT_YEAR - child.year_of_birth : null

  const labelStyle = {
    fontSize: '11px', fontWeight: 600, color: C.blue,
    textTransform: 'uppercase', letterSpacing: '0.06em',
    display: 'block', marginBottom: '6px',
  }


  if (!loaded) return null

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>

      {/* Page header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
          <span style={{ fontSize: '12px', color: C.textMuted }}>Dashboard</span>
          <span style={{ color: C.border }}>/</span>
          <span style={{ fontSize: '12px', color: C.textSub, fontWeight: 500 }}>Child's Area</span>
        </div>
        <h1 style={{ fontSize: '26px', fontWeight: 700, color: C.text, letterSpacing: '-0.02em' }}>Child's Area</h1>
        <p style={{ fontSize: '14px', color: C.textMuted, marginTop: '4px' }}>
          {child ? "Your child's profile" : "Set up your child's profile to get started"}
        </p>
      </div>

      {/* Card */}
      <div style={{
        backgroundColor: C.card, border: `1px solid ${C.border}`,
        borderRadius: '20px', padding: '32px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        display: 'flex', flexDirection: 'column', gap: '24px',
      }}>

        {/* Avatar + name header (only if child exists) */}
        {child && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '24px', borderBottom: `1px solid ${C.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '22px', fontWeight: 700, color: '#1d4ed8', flexShrink: 0,
              }}>
                {child.name?.[0]}
              </div>
              <div>
                <p style={{ fontSize: '17px', fontWeight: 600, color: C.text }}>{child.name}</p>
                <p style={{ fontSize: '13px', color: C.textMuted }}>{child.gender} · {age} years old</p>
              </div>
            </div>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 16px', borderRadius: '10px',
                  border: `1px solid ${C.border}`, backgroundColor: C.card,
                  fontSize: '13px', fontWeight: 500, color: C.textSub,
                  cursor: 'pointer',
                }}
              >
                <Pencil size={13} /> Edit
              </button>
            )}
          </div>
        )}

        {/* Fields */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Child's Name</label>
            <Input name="name" placeholder="Daniel" disabled={!isEditing} value={form.name} onChange={handleChange} />
          </div>
          <div>
            <label style={labelStyle}>Year of Birth</label>
            <Input name="year_of_birth" type="number" placeholder={String(CURRENT_YEAR - 10)} disabled={!isEditing} value={form.year_of_birth} onChange={handleChange} />
          </div>
          <div>
            <label style={labelStyle}>Gender</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              disabled={!isEditing}
              style={{
                width: '100%', padding: '10px 14px', borderRadius: '10px',
                border: `1px solid ${isEditing ? C.blue : C.border}`,
                fontSize: '14px', color: !isEditing ? C.textMuted : C.textSub,
                backgroundColor: !isEditing ? '#f8fafc' : C.card,
                outline: 'none', cursor: !isEditing ? 'not-allowed' : 'pointer',
                boxSizing: 'border-box',
                boxShadow: isEditing ? `0 0 0 3px ${C.blueTint}` : 'none',
              }}
            >
              <option value="">Select gender</option>
              {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
        </div>

        {/* Mental considerations */}
        <div>
          <label style={labelStyle}>Mental Health Considerations</label>
          <p style={{ fontSize: '12px', color: C.textMuted, marginBottom: '8px' }}>
            Any relevant notes that help the AI better assess your child's activity.
          </p>
          <textarea
            name="mental_considerations"
            value={form.mental_considerations}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="e.g. ADHD, anxiety, history of bullying..."
            rows={4}
            style={{
              width: '100%', padding: '12px 14px', borderRadius: '10px',
              border: `1px solid ${isEditing ? C.blue : C.border}`,
              fontSize: '14px', color: !isEditing ? C.textMuted : C.textSub,
              backgroundColor: !isEditing ? '#f8fafc' : C.card,
              outline: 'none', resize: 'vertical', lineHeight: 1.6,
              boxShadow: isEditing ? `0 0 0 3px ${C.blueTint}` : 'none',
              cursor: !isEditing ? 'not-allowed' : 'text',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Actions */}
        {isEditing && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            {child && (
              <button
                onClick={() => { setEditing(false); setForm({ name: child.name, year_of_birth: child.year_of_birth, gender: child.gender, mental_considerations: child.mental_considerations ?? '' }) }}
                style={{
                  padding: '10px 20px', borderRadius: '10px',
                  border: `1px solid ${C.border}`, backgroundColor: C.card,
                  fontSize: '14px', fontWeight: 500, color: C.textSub, cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              className={!saving ? 'btn-gradient' : ''}
              style={{
                padding: '10px 28px', borderRadius: '10px', border: 'none',
                background: saving ? '#e4e7ec' : undefined,
                color: saving ? C.textMuted : '#fff',
                fontSize: '14px', fontWeight: 600,
                cursor: saving ? 'not-allowed' : 'pointer',
                boxShadow: saving ? 'none' : '0 2px 8px rgba(37,99,235,0.35)',
              }}
            >
              {saving ? 'Saving...' : child ? 'Save Changes' : 'Create Profile'}
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
