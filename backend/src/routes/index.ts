import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { FuncionarioService } from '../services/FuncionarioService';
import { FuncionarioController } from '../controllers/FuncionarioController';
import { AeronaveService } from '../services/AeronaveService';
import { AeronaveController } from '../controllers/AeronaveController';
import { PecaService } from '../services/PecaService';
import { PecaController } from '../controllers/PecaController';
import { EtapaService } from '../services/EtapaService';
import { EtapaController } from '../controllers/EtapaController';
import { TesteService } from '../services/TesteService';
import { TesteController } from '../controllers/TesteController';

import { authMiddleware } from '../middlewares/authMiddleware';

const routes = Router();

const adapter = new PrismaBetterSqlite3({
  url: 'file:./dev.db'
});
const prisma = new PrismaClient({ adapter });

const funcionarioService = new FuncionarioService(prisma);
const funcionarioController = new FuncionarioController(funcionarioService);

const aeronaveService = new AeronaveService(prisma);
const aeronaveController = new AeronaveController(aeronaveService);

const pecaService = new PecaService(prisma);
const pecaController = new PecaController(pecaService);

const etapaService = new EtapaService(prisma);
const etapaController = new EtapaController(etapaService);

const testeService = new TesteService(prisma);
const testeController = new TesteController(testeService);

routes.post('/funcionarios/registar', funcionarioController.handleRegisto);
routes.post('/login', funcionarioController.handleLogin);

// Funcionários (Admin)
routes.get('/funcionarios', authMiddleware, funcionarioController.handleListar);
routes.put('/funcionarios/:id', authMiddleware, funcionarioController.handleAtualizar);
routes.delete('/funcionarios/:id', authMiddleware, funcionarioController.handleExcluir);

// Aeronaves
routes.get('/aeronaves', authMiddleware, aeronaveController.listar);
routes.post('/aeronaves', authMiddleware, aeronaveController.criar);
routes.put('/aeronaves/:id', authMiddleware, aeronaveController.atualizar);
routes.delete('/aeronaves/:id', authMiddleware, aeronaveController.excluir);

// Peças
routes.get('/pecas', authMiddleware, pecaController.listar);
routes.post('/pecas', authMiddleware, pecaController.criar);
routes.put('/pecas/:id', authMiddleware, pecaController.atualizar);
routes.delete('/pecas/:id', authMiddleware, pecaController.excluir);

// Etapas
routes.get('/etapas', authMiddleware, etapaController.listar);
routes.post('/etapas', authMiddleware, etapaController.criar);
routes.put('/etapas/:id', authMiddleware, etapaController.atualizar);
routes.delete('/etapas/:id', authMiddleware, etapaController.excluir);

// Testes
routes.get('/testes', authMiddleware, testeController.listar);
routes.post('/testes', authMiddleware, testeController.criar);
routes.put('/testes/:id', authMiddleware, testeController.atualizar);
routes.delete('/testes/:id', authMiddleware, testeController.excluir);

export default routes;