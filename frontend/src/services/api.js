// src/services/api.js  — camada de comunicação com o back-end

const BASE = "http://localhost:3000/api"; // Alinhado com a porta do nosso server.ts

function getToken() {
  return localStorage.getItem("aerocode_token");
}

async function request(method, path, body) {
  const headers = { 
    "Content-Type": "application/json",
    "X-Request-Start": Date.now().toString()
  };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return null;

  const data = await res.json().catch(() => ({})); // Previne quebra caso o server devolva vazio

  // ALINHAMENTO DEFENSIVO: Verifica "erro" (pt-BR do nosso backend) ou "error"
  if (!res.ok)
    throw new Error(
      data.erro || data.error || "Erro na requisição ou bloqueio do Firewall",
    );

  return data;
}

export const api = {
  // Auth (Alterei o path para bater exatamente na nossa rota do Express)
  login: (usuario, senha) => request("POST", "/login", { usuario, senha }),

  // Aeronaves
  getAeronaves: () => request("GET", "/aeronaves"),
  getAeronave: (id) => request("GET", `/aeronaves/${id}`),
  createAeronave: (data) => request("POST", "/aeronaves", data),
  updateAeronave: (id, data) => request("PUT", `/aeronaves/${id}`, data),
  deleteAeronave: (id) => request("DELETE", `/aeronaves/${id}`),

  // Peças
  getPecas: () => request("GET", "/pecas"),
  createPeca: (data) => request("POST", "/pecas", data),
  updatePeca: (id, data) => request("PUT", `/pecas/${id}`, data),
  deletePeca: (id) => request("DELETE", `/pecas/${id}`),

  // Etapas
  getEtapas: () => request("GET", "/etapas"),
  createEtapa: (d) => request("POST", "/etapas", d),
  updateEtapa: (id, d) => request("PUT", `/etapas/${id}`, d),
  avancarEtapa: (id) => request("PATCH", `/etapas/${id}/avancar`),
  deleteEtapa: (id) => request("DELETE", `/etapas/${id}`),

  // Testes
  getTestes: () => request("GET", "/testes"),
  createTeste: (data) => request("POST", "/testes", data),
  updateTeste: (id, data) => request("PUT", `/testes/${id}`, data),
  deleteTeste: (id) => request("DELETE", `/testes/${id}`),

  // Funcionários (admin)
  getFuncionarios: () => request("GET", "/funcionarios"),
  createFuncionario: (data) => request("POST", "/funcionarios/registar", data), // Rota do server
  updateFuncionario: (id, data) => request("PUT", `/funcionarios/${id}`, data),
  deleteFuncionario: (id) => request("DELETE", `/funcionarios/${id}`),

  // Relatórios (admin)
  getRelatorio: (aeronaveId) => request("GET", `/relatorios/${aeronaveId}`),
};
