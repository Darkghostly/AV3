import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const decodificarToken = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const dadosUsuario = decodificarToken(token);
      if (dadosUsuario) {
        setUser(dadosUsuario);
      }
    }
  }, []);

  const login = async (usuario, senha) => {
    try {
      const data = await apiFetch('/login', {
        method: 'POST',
        body: JSON.stringify({ usuario, senha })
      });

      localStorage.setItem('token', data.token);
      const dadosUsuario = decodificarToken(data.token);
      setUser(dadosUsuario);
      
      return { sucesso: true };
    } catch (error) {
      return { sucesso: false, erro: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const permissao = user?.permissao;
  
  const isAdmin = permissao === 'ADMINISTRADOR';
  const isEng   = permissao === 'ENGENHEIRO' || isAdmin;
  const isOp    = permissao === 'OPERADOR' || isEng;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, isEng, isOp }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() { 
    return useContext(AuthContext); 
}