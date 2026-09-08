import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, FileText, PlusSquare, Calendar,
  Link2, Settings, LogOut, Zap
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { to: '/dashboard',        label: 'Dashboard',      icon: LayoutDashboard },
  { to: '/posts',            label: 'Posts',           icon: FileText },
  { to: '/create',           label: 'Create Post',     icon: PlusSquare },
  { to: '/schedule',         label: 'Schedule',        icon: Calendar },
  { to: '/social-accounts',  label: 'Social Accounts', icon: Link2 },
]

function getInitials(name) {
  if (!name) return '?'
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <aside className={`sidebar${open ? ' open' : ''}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <Zap size={14} color="#fff" strokeWidth={2.5} />
        </div>
        <span className="sidebar-logo-text">SocialPilot</span>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="sidebar-nav-section">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `sidebar-nav-item${isActive ? ' active' : ''}`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </div>

        <div className="sidebar-divider" />

        <NavLink
          to="/settings"
          onClick={onClose}
          className={({ isActive }) =>
            `sidebar-nav-item${isActive ? ' active' : ''}`
          }
        >
          <Settings size={16} />
          Settings
        </NavLink>
      </nav>

      {/* User */}
      <div className="sidebar-user">
        <div className="avatar avatar-sm">
          {getInitials(user?.name)}
        </div>
        <div className="sidebar-user-info">
          <div className="sidebar-user-name">{user?.name || 'User'}</div>
          <div className="sidebar-user-email">{user?.email || ''}</div>
        </div>
        <button
          className="sidebar-logout"
          onClick={handleLogout}
          title="Logout"
        >
          <LogOut size={15} />
        </button>
      </div>
    </aside>
  )
}
