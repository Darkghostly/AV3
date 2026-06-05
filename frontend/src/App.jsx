import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Aeronaves from './pages/Aeronaves'
import Pecas from './pages/Pecas'
import Etapas from './pages/Etapas'
import Testes from './pages/Testes'
import Funcionarios from './pages/Funcionarios'
import Relatorios from './pages/Relatorios'

function PrivateRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

function AdminRoute({ children }) {
  const { user, isAdmin } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="aeronaves" element={<Aeronaves />} />
            <Route path="pecas" element={<Pecas />} />
            <Route path="etapas" element={<Etapas />} />
            <Route path="testes" element={<Testes />} />
            <Route path="funcionarios" element={<AdminRoute><Funcionarios /></AdminRoute>} />
            <Route path="relatorios" element={<AdminRoute><Relatorios /></AdminRoute>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
