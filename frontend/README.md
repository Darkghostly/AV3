# Aerocode GUI — SPA React

Sistema de Gestão da Produção de Aeronaves  
**AV2 — Engenharia de Software | Prof. Gerson Penha**

---

## Como rodar

### Pré-requisitos
- Node.js 18+ instalado
- Terminal (PowerShell ou CMD no Windows)

### Passos

```bash
# 1. Entrar na pasta do projeto
cd aerocode-gui

# 2. Instalar dependências
npm install

# 3. Rodar em modo desenvolvimento
npm run dev
```

Abra o navegador em: **http://localhost:5173**

---

## Usuários de teste

| Matrícula | Senha | Nível         |
|-----------|-------|---------------|
| admin     | 1234  | ADMINISTRADOR |
| eng01     | 1234  | ENGENHEIRO    |
| op01      | 1234  | OPERADOR      |

---

## Módulos disponíveis

| Módulo         | Operador | Engenheiro | Administrador |
|----------------|----------|------------|---------------|
| Dashboard      | ✅       | ✅         | ✅            |
| Aeronaves      | Ver      | CRUD       | CRUD          |
| Peças          | Status   | CRUD       | CRUD          |
| Etapas         | Ver      | CRUD+Kanban| CRUD+Kanban   |
| Testes         | Ver      | CRUD       | CRUD          |
| Funcionários   | ❌       | ❌         | ✅ CRUD       |
| Relatórios     | ❌       | ❌         | ✅ + Export   |

---

## Tecnologias

- **React 18** — biblioteca de UI
- **React Router v6** — navegação SPA (sem recarregar página)
- **Vite** — build tool moderno
- **CSS puro** — sem frameworks externos

---

## Compatibilidade

- Windows 10 ou superior
- Linux Ubuntu 24.04.03 ou superior
