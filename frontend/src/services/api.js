const BASE_URL = 'http://localhost:3000/api';
export const apiFetch = async (endpoint, options = {}) => {
  
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.erro || 'Falha na comunicação com o servidor seguro.');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro de rede ou bloqueio:', error.message);
    throw error;
  }
};