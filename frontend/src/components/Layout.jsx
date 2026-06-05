import { useEffect, useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Layout.css'

const ICON = {
  dashboard:     '▦',
  aeronaves:     '✈',
  pecas:         '⚙',
  etapas:        '◈',
  testes:        '⬡',
  funcionarios:  '◉',
  relatorios:    '▤',
  sair:          '⏻',
}

export default function Layout() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [isRolling, setIsRolling] = useState(false)

  useEffect(() => {
    let buffer = ''
    const target = 'do a barrel roll'
    
    function handleKeyDown(e) {
      if (e.key.length === 1 || e.key === ' ') {
        buffer += e.key.toLowerCase()
        if (buffer.length > target.length) {
          buffer = buffer.slice(-target.length)
        }
        if (buffer === target) {
          setIsRolling(true)
          setTimeout(() => setIsRolling(false), 2000)
          buffer = ''
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const navItems = [
    { to: '/',             label: 'Dashboard',    icon: ICON.dashboard,    end: true },
    { to: '/aeronaves',    label: 'Aeronaves',    icon: ICON.aeronaves },
    { to: '/pecas',        label: 'Peças',        icon: ICON.pecas },
    { to: '/etapas',       label: 'Etapas',       icon: ICON.etapas },
    { to: '/testes',       label: 'Testes',       icon: ICON.testes },
    ...(isAdmin ? [
      { to: '/funcionarios', label: 'Funcionários', icon: ICON.funcionarios, badge: 'ADM' },
      { to: '/relatorios',   label: 'Relatórios',   icon: ICON.relatorios,   badge: 'ADM' },
    ] : []),
  ]

  return (
    <div className={`shell ${isRolling ? 'barrel-roll' : ''}`}>
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-icon">✈</span>
          <span className="brand-text">AEROCODE</span>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {item.badge && <span className="nav-badge">{item.badge}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">{user.nome[0]}</div>
            <div className="user-meta">
              <span className="user-name">{user.nome}</span>
              <span className="user-level">{user.nivel}</span>
            </div>
          </div>
          <button className="btn-logout" onClick={handleLogout} title="Sair">
            {ICON.sair}
          </button>
        </div>
      </aside>

      <main className="content">
        <Outlet />
      </main>
    </div>
  )
}
