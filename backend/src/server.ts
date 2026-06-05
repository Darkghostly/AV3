import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { metricsMiddleware } from './middlewares/metrics';
import apiRoutes from './routes';

const app = express();

app.use(helmet()); 
app.use(cors());
app.use(express.json()); 

app.use((req, res, next) => {
  res.setHeader('X-Defense-Protocol', 'XCOM-Active');
  res.setHeader('X-OSINT-Tracker', 'Sherlock is watching you');
  res.setHeader('X-Sec-Squad', 'Foco em SEC CLUB - Fatec');
  res.setHeader('X-Pix-Bribe-Status', 'Denied'); 
  next();
});

app.use(metricsMiddleware);
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: process.env.NODE_ENV === 'test' ? 100000 : 100, 
  message: "Muitas requisições detetadas. Firewall ativado."
});
app.use(limiter);

app.get('/', (req, res) => {
  res.json({ mensagem: 'API do Backend AV3 está ativa e rodando!' });
});

app.use('/api', apiRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
