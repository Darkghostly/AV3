import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { FuncionarioService } from '../services/FuncionarioService';
import { FuncionarioController } from '../controllers/FuncionarioController';
import { AeronaveService } from '../services/AeronaveService';
import { AeronaveController } from '../controllers/AeronaveController';

import { authMiddleware } from '../middlewares/authMiddleware';

const routes = Router();
const prisma = new PrismaClient();

const funcionarioService = new FuncionarioService(prisma);
const funcionarioController = new FuncionarioController(funcionarioService);

const aeronaveService = new AeronaveService(prisma);
const aeronaveController = new AeronaveController(aeronaveService);

// ---------------------------------------------------------
// Rotas Públicas (Não precisam de Token)
// ---------------------------------------------------------
routes.post('/funcionarios/registar', funcionarioController.handleRegisto);
routes.post('/login', funcionarioController.handleLogin);

// ---------------------------------------------------------
// Rotas Privadas (Protegidas pelo Middleware JWT)
// ---------------------------------------------------------
routes.get('/aeronaves', authMiddleware, aeronaveController.listar);
routes.post('/aeronaves', authMiddleware, aeronaveController.criar);

export default routes;