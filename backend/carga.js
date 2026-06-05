// carga.js — Injeta o timestamp no cabeçalho para medir a latência
function setupHeaders(client, state) {
  client.setHeaders({
    'X-Request-Start': Date.now().toString()
  });
  return client;
}

module.exports = setupHeaders;
