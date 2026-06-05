import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Login.css'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [matricula, setMatricula] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    setLoading(true)
    setTimeout(() => {
      const ok = login(matricula, senha)
      if (ok) navigate('/')
      else setErro('Usuário ou senha inválidos. Tente novamente.')
      setLoading(false)
    }, 400)
  }

  return (
    <div className="login-shell">
      <div className="login-brand">
        <div className="login-brand-icon">✈</div>
        <h1 className="login-brand-name">AEROCODE</h1>
        <p className="login-brand-sub">Sistema de Gestão da Produção de Aeronaves</p>
        <div className="login-brand-divider" />
        <p className="login-brand-note">v2.0 — Interface GUI / SPA</p>
      </div>

      <div className="login-form-area">
        <div className="login-card">
          <h2 className="login-title">Acesso ao Sistema</h2>
          <p className="login-hint">Use: <code>admin / 1234</code> &nbsp;|&nbsp; <code>eng01 / 1234</code> &nbsp;|&nbsp; <code>op01 / 1234</code></p>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-field">
              <label>Usuário</label>
              <input
                type="text"
                placeholder="ex: admin"
                value={matricula}
                onChange={e => setMatricula(e.target.value)}
                autoFocus
                required
              />
            </div>
            <div className="form-field">
              <label>Senha</label>
              <div className="password-input-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={senha}
                  onChange={e => setSenha(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="btn-toggle-pass"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? "Ocultar senha" : "Ver senha"}
                >
                  {showPassword ? "👁‍🗨" : "👁"}
                </button>
              </div>
            </div>

            {erro && <div className="login-erro">{erro}</div>}

            <button className="btn btn-primary login-btn" type="submit" disabled={loading}>
              {loading ? 'Verificando...' : 'Entrar'}
            </button>
          </form>
        </div>
        <p className="login-footer">Aerocode Ltda. · Acesso restrito a colaboradores autorizados</p>
      </div>
    </div>
  )
}
