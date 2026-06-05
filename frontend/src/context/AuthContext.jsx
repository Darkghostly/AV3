// src/context/AuthContext.jsx
import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

// Usuários mock — simulam o banco do CLI
const USERS = [
  { id: 1, matricula: 'admin',    senha: '1234', nome: 'Carlos Souza',   nivel: 'ADMINISTRADOR' },
  { id: 2, matricula: 'eng01',    senha: '1234', nome: 'Ana Lima',       nivel: 'ENGENHEIRO' },
  { id: 3, matricula: 'op01',     senha: '1234', nome: 'Pedro Moraes',   nivel: 'OPERADOR' },
]

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  function login(matricula, senha) {
    const found = USERS.find(u => u.matricula === matricula && u.senha === senha)
    if (found) { setUser(found); return true }
    return false
  }

  function logout() { setUser(null) }

  const isAdmin  = user?.nivel === 'ADMINISTRADOR'
  const isEng    = user?.nivel === 'ENGENHEIRO' || isAdmin
  const isOp     = true // todos têm nível operador mínimo

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, isEng }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() { return useContext(AuthContext) }
