import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IFuncionarioService } from '../interfaces/IFuncionarioService';

export class FuncionarioService implements IFuncionarioService {
  private db: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.db = prisma;
  }

  public async registar(nome: string, usuario: string, senhaPlana: string, permissao: string) {
    const saltRounds = 12;
    const senhaHash = await bcrypt.hash(senhaPlana, saltRounds);

    return await this.db.funcionario.create({
      data: {
        nome,
        usuario,
        senha: senhaHash,
        permissao
      },
      select: { id: true, nome: true, usuario: true, permissao: true }
    });
  }

  public async login(usuario: string, senhaPlana: string): Promise<string | null> {
    const funcionario = await this.db.funcionario.findUnique({ where: { usuario } });

    if (!funcionario) return null;

    const senhaValida = await bcrypt.compare(senhaPlana, funcionario.senha);
    if (!senhaValida) return null;

    const secret = process.env.JWT_SECRET || 'chave-super-secreta-aerocode-av3';
    return jwt.sign({ id: funcionario.id, permissao: funcionario.permissao }, secret, { expiresIn: '2h' });
  }
}