import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import Database from 'better-sqlite3';
import { FuncionarioService } from '../services/FuncionarioService';
import { FuncionarioController } from '../controllers/FuncionarioController';
import { AeronaveService } from '../services/AeronaveService';
import { AeronaveController } from '../controllers/AeronaveController';

import { authMiddleware } from '../middlewares/authMiddleware';

const routes = Router();

const db = new Database('dev.db');
const adapter = new PrismaBetterSqlite3(db);
const prisma = new PrismaClient({ adapter });

const funcionarioService = new FuncionarioService(prisma);
const funcionarioController = new FuncionarioController(funcionarioService);

const aeronaveService = new AeronaveService(prisma);
const aeronaveController = new AeronaveController(aeronaveService);

routes.post('/funcionarios/registar', funcionarioController.handleRegisto);
routes.post('/login', funcionarioController.handleLogin);
// Rotas Privadas (Protegidas pelo Middleware JWT)
// ---------------------------------------------------------
routes.get('/aeronaves', authMiddleware, aeronaveController.listar);
routes.post('/aeronaves', authMiddleware, aeronaveController.criar);

export default routes;