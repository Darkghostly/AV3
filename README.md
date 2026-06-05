# ✈️ Aerocode — Sistema de Gestão da Produção e Telemetria Aeronáutica

O **Aerocode** é uma aplicação web Fullstack desenvolvida para a gestão crítica, controle de qualidade e telemetria de fabricação de aeronaves. Projetado sob os exigentes padrões do setor aeronáutico — alinhando-se aos requisitos operacionais de gigantes como Boeing, Airbus e Embraer —, o sistema garante rastreabilidade total de peças, etapas de montagem, testes de integridade e gestão de funcionários responsáveis.

---

## 🚀 Principais Evoluções da AV3

* **Arquitetura Fullstack Desacoplada**: Separação clara entre a interface dinâmica do cliente (React + Vite) e os serviços de processamento de regras de negócios do servidor (Node.js + Express).
* **Persistência de Dados com Prisma ORM**: Modelagem de dados relacional e migrações controladas, compatível com MySQL e SQLite, garantindo integridade referencial nas tabelas de peças, aeronaves, etapas e testes.
* **Segurança e Controle de Acesso Crítico**: 
  - Criptografia irreversível de senhas com `bcrypt`.
  - Autenticação *stateless* e controle de autorização baseados em tokens JWT.
  - Salvaguardas operacionais que impedem a exclusão de contas administrativas centrais (`Super Admin`) e restringem a alocação de etapas de montagem apenas a funcionários ativos no sistema.
* **Middleware de Telemetria Integrado**: Captura contínua de latência de rede (round-trip), tempo de processamento do servidor (com precisão de clock de CPU) e tempo de resposta total, salvando as medições em logs estruturados para auditoria de desempenho de qualidade.

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia | Justificativa |
| :--- | :--- | :--- |
| **Frontend** | React (Vite) | Interface ágil, componentizada, reativa e otimizada para os operadores de montagem. |
| **Backend** | Node.js (Express) | Servidor assíncrono baseado em eventos, focado em alta escalabilidade e baixo consumo. |
| **Persistência** | Prisma ORM | Agilidade na escrita de queries, segurança contra SQL Injection e gestão moderna de migrations. |
| **Banco de Dados** | MySQL | Armazenamento relacional robusto com forte consistência e conformidade ACID para dados fabris. |
| **Segurança** | JWT & bcrypt | Autenticação sem estado (*stateless*) e armazenamento seguro de dados de acesso. |
| **Containers** | Docker / Docker Compose | Isolamento dos serviços de banco de dados e garantia de paridade entre desenvolvimento e produção. |

---

## 💻 Guia de Execução

Siga os passos abaixo para preparar o ambiente e rodar o projeto localmente:

### 1. Clonagem do Repositório
```bash
git clone <url-do-repositorio>
cd AV3
```

### 2. Configuração das Variáveis de Ambiente (`.env`)
No diretório `backend/`, crie um arquivo `.env` para configurar a conexão com o banco de dados e as chaves de segurança:
```env
# Porta de execução do servidor backend
PORT=3000

# String de Conexão com o banco de dados MySQL
DATABASE_URL="mysql://root:aerocode_secret@localhost:3306/aerocode_db"

# Chave secreta de criptografia para assinatura de tokens JWT
JWT_SECRET="chave-super-secreta-aerocode-av3"

# Variável de ambiente para habilitar teste de carga (desativa limitação do Rate-Limiter)
NODE_ENV="development"
```

### 3. Inicialização do Banco de Dados com Docker
Suba a instância isolada do MySQL configurada no seu `docker-compose.yml`:
```bash
docker-compose up -d
```

### 4. Instalação e Execução do Backend
A partir da raiz do projeto, acesse a pasta `backend/`, instale as dependências e aplique as migrações do banco de dados:
```bash
cd backend
npm install

# Executar migrações do banco de dados
npx prisma migrate dev --name init

# Iniciar o servidor em ambiente de desenvolvimento
npm run dev
```

### 5. Instalação e Execução do Frontend
Em um novo terminal, a partir da raiz do projeto, acesse a pasta `frontend/`, instale as dependências e inicie a interface:
```bash
cd frontend
npm install
npm run dev
```

Acesse a aplicação no navegador em `http://localhost:5173`. Use as credenciais configuradas para acessar a plataforma.

---

## 📊 Relatório de Qualidade e Telemetria

O sistema conta com um **Middleware de Telemetria** integrado em [metrics.ts](file:///c:/Users/tavob/Documents/AV3/backend/src/middlewares/metrics.ts) que monitora continuamente:
* **Latência de Rede**: Calculada por meio do cabeçalho HTTP `X-Request-Start` enviado pelo cliente.
* **Tempo de Processamento do Servidor**: Medido com `performance.now()`, oferecendo resolução em microssegundos direto da CPU.
* **Tempo de Resposta Total**: A soma de rede e processamento interno.

Todos os registros são salvos assincronamente em [logs_qualidade.json](file:///c:/Users/tavob/Documents/AV3/backend/logs_qualidade.json) para auditorias de garantia de qualidade (QA) e posterior renderização de gráficos de desempenho.

---
