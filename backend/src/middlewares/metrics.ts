import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import { performance } from 'perf_hooks';

const logFilePath = path.join(__dirname, '..', '..', 'logs_qualidade.json');

export const metricsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const serverArrivalTime = Date.now();
  const startCpu = performance.now();

  res.on('finish', () => {
    const endCpu = performance.now();
    const processingTime = Number((endCpu - startCpu).toFixed(3)); // Server processing time in ms

    // Calculate network latency if X-Request-Start header is present
    let networkLatency = 0;
    const clientSendTimeHeader = req.headers['x-request-start'];
    if (clientSendTimeHeader) {
      const clientSendTime = Number(clientSendTimeHeader);
      if (!isNaN(clientSendTime)) {
        networkLatency = Math.max(0, serverArrivalTime - clientSendTime);
      }
    }

    const totalResponseTime = Number((networkLatency + processingTime).toFixed(3));

    const logEntry = {
      timestamp: new Date().toISOString(),
      metodo: req.method,
      rota: req.originalUrl,
      status: res.statusCode,
      latenciaRedeMs: networkLatency,
      processamentoServidorMs: processingTime,
      tempoRespostaTotalMs: totalResponseTime,
    };

    // Print to console in a structured format
    console.log(`[Telemetria] ${req.method} ${req.originalUrl} - Status: ${res.statusCode} | Rede: ${networkLatency}ms | Servidor: ${processingTime}ms | Total: ${totalResponseTime}ms`);

    // Safely write to logs_qualidade.json as JSON Lines
    try {
      fs.appendFile(logFilePath, JSON.stringify(logEntry) + '\n', (err) => {
        if (err) {
          console.error('[Telemetria] Erro ao gravar log de qualidade:', err);
        }
      });
    } catch (e) {
      console.error('[Telemetria] Falha de escrita no arquivo:', e);
    }
  });

  next();
};
