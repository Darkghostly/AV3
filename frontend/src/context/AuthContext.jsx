import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  // Recupera sessão do localStorage ao recarregar a página (com postura defensiva)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('aerocode_user')
      if (saved && saved !== 'undefined') {
        setUser(JSON.parse(saved))
      }
    } catch (e) {
      // Se o cache estiver corrompido, limpa tudo para não dar tela branca
      localStorage.removeItem('aerocode_user')
      localStorage.removeItem('aerocode_token')
    }
    setLoading(false)
  }, [])

  async function login(matricula, senha) {
    try {
      const data = await api.login(matricula, senha)   
      localStorage.setItem('aerocode_token', data.token)
      
      const base64Url = data.token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const payload = JSON.parse(decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')))
      
      localStorage.setItem('aerocode_user',  JSON.stringify(payload))
      setUser(payload)
      
      return { sucesso: true }
    } catch (error) {
      // O escudo de segurança: Se o servidor der erro 500 ou 401, a tela para de carregar e mostra o erro!
      return { sucesso: false, erro: error.message }
    }
  }

  function logout() {
    localStorage.removeItem('aerocode_token')
    localStorage.removeItem('aerocode_user')
    setUser(null)
  }

  const isAdmin = user?.permissao === 'ADMINISTRADOR'
  const isEng   = user?.permissao === 'ENGENHEIRO' || isAdmin

  if (loading) return null   // evita flash de tela

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, isEng }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() { return useContext(AuthContext) }