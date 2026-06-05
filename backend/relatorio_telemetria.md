# Relatório de Telemetria e Desempenho (AV3)
**Disciplina:** Gestão da Produção de Aeronaves / Engenharia de Qualidade  
**Professor:** Dr. Gerson Penha  

Este documento apresenta a metodologia técnica e os scripts de teste de carga utilizados para gerar as métricas de qualidade do sistema de fabricação de aeronaves.

---

## 1. Metodologia Técnica de Medição

Para garantir que o backend capture com precisão as métricas em tempo real sem afetar o desempenho da aplicação, criamos um **Middleware de Telemetria** estruturado em Express que mede três variáveis críticas:

### A. Latência de Rede (Ida e Volta)
Como um servidor backend só toma conhecimento de uma requisição a partir do momento em que ela chega, o servidor por si só não sabe quanto tempo ela levou para trafegar pela rede (do navegador até o servidor).
* **Solução:** O frontend React (ou o script de teste de carga) insere o cabeçalho HTTP `X-Request-Start` contendo o timestamp em milissegundos (`Date.now()`) no momento exato do envio.
* **Cálculo:** O backend captura a data de chegada do servidor (`serverArrivalTime`) e calcula:
  $$\text{Latência de Rede (ms)} = \text{serverArrivalTime} - \text{clientSendTime}$$

### B. Tempo de Processamento do Servidor
O tempo em que a requisição ficou sob a responsabilidade do Express/Node.js e Prisma executando a lógica de banco de dados.
* **Solução:** Utilizamos o recurso nativo `performance.now()` da biblioteca `perf_hooks` do Node.js. Diferente do `Date.now()`, o `performance.now()` utiliza timers de alta resolução vinculados ao clock do processador, fornecendo precisão de microssegundos (ex: `1.452ms`), imune a ajustes e sincronizações do relógio do sistema operacional.
* **Cálculo:**
  $$\text{Tempo de Processamento (ms)} = \text{Tempo final (finish)} - \text{Tempo inicial (Request entered Express)}$$

### C. Tempo de Resposta Total
A soma total da latência de rede mais o tempo de processamento da lógica do servidor.
* **Cálculo:**
  $$\text{Tempo Total (ms)} = \text{Latência de Rede} + \text{Tempo de Processamento do Servidor}$$

---

## 2. Estrutura dos Logs de Qualidade

Todas as requisições geradas disparam a escrita assíncrona (não-bloqueante via `fs.appendFile`) de uma nova linha no arquivo [logs_qualidade.json](file:///c:/Users/tavob/Documents/AV3/backend/logs_qualidade.json) seguindo o padrão JSON Lines (NDJSON):

```json
{"timestamp":"2026-06-05T21:18:22.450Z","metodo":"GET","rota":"/api/pecas","status":200,"latenciaRedeMs":4,"processamentoServidorMs":2.341,"tempoRespostaTotalMs":6.341}
```

---

## 3. Simulação de Carga (1, 5 e 10 Usuários Simultâneos)

Para simular o tráfego do sistema e gerar os dados para o seu gráfico, usaremos o **Autocannon**, uma ferramenta de teste de carga extremamente veloz escrita em Node.js.

### Passo 1: Instalação do Autocannon
Você pode rodar diretamente via `npx` (não precisa instalar globalmente), mas se preferir instalar, rode:
```bash
npm install -g autocannon
```

### Passo 2: Scripts de Carga
Para cada teste, enviaremos o cabeçalho `X-Request-Start` dinamicamente usando uma função JavaScript executada pelo Autocannon antes de enviar cada requisição.

Crie um arquivo chamado `carga.js` na raiz da pasta `backend/` contendo o seguinte script:

```javascript
// carga.js — Injeta o timestamp no cabeçalho para medir a latência
function setupHeaders(client, state) {
  client.setHeaders({
    'X-Request-Start': Date.now().toString()
  });
}

module.exports = setupHeaders;
```

#### Cenário 1: 1 Usuário Simultâneo (Duração: 10 segundos)
```bash
npx autocannon -c 1 -d 10 -t 5 -s ./carga.js http://localhost:3000/api/aeronaves
```

#### Cenário 2: 5 Usuários Simultâneos (Duração: 10 segundos)
```bash
npx autocannon -c 5 -d 10 -t 5 -s ./carga.js http://localhost:3000/api/aeronaves
```

#### Cenário 3: 10 Usuários Simultâneos (Duração: 10 segundos)
```bash
npx autocannon -c 10 -d 10 -t 5 -s ./carga.js http://localhost:3000/api/aeronaves
```

*Explicação dos parâmetros:*
* `-c <N>`: Número de conexões simultâneas (usuários concorrentes).
* `-d 10`: Duração do teste (10 segundos).
* `-t 5`: Timeout limite de resposta (5 segundos).
* `-s ./carga.js`: Carrega nosso script para injetar dinamicamente a data e hora do envio.

---

## 4. Como gerar os gráficos para o Relatório

Você pode importar o conteúdo do arquivo [logs_qualidade.json](file:///c:/Users/tavob/Documents/AV3/backend/logs_qualidade.json) em ferramentas como o Excel, Google Sheets, ou rodar um script em Python (Pandas/Matplotlib) para gerar gráficos de linhas comparando os tempos nos 3 cenários (1, 5 e 10 usuários simultâneos).
