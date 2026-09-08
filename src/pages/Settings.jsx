import { useNavigate } from 'react-router-dom'
import { LogOut, User, Shield, Server } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function Settings() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()

  const handleLogout = () => {
    logout()
    toast.info('Signed out successfully')
    navigate('/login')
  }

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Manage your account information and preferences</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: 640 }}>
        {/* Profile Card */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <User size={16} />
              User Profile
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                value={user?.name || ''}
                readOnly
                style={{ background: 'var(--color-bg)' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                value={user?.email || ''}
                readOnly
                style={{ background: 'var(--color-bg)' }}
              />
            </div>
          </div>
        </div>

        {/* Security / Session Card */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Shield size={16} />
              Authentication & Session
            </h2>
          </div>

          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 16 }}>
            Your session is secured using standard JSON Web Tokens (JWT). Logging out will clear the session token stored in your browser.
          </p>

          <button
            type="button"
            className="btn btn-danger"
            onClick={handleLogout}
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>

        {/* System Info Card */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Server size={16} />
              Backend Connection
            </h2>
          </div>

          <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
            <div><strong>Environment:</strong> Development</div>
            <div><strong>API Base URL:</strong> {import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}</div>
            <div><strong>Application:</strong> SocialPilot v1.0.0 (Spring Boot + React)</div>
          </div>
        </div>
      </div>
    </div>
  )
}
