import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IFuncionarioService } from '../interfaces/IFuncionarioService';

export class FuncionarioService implements IFuncionarioService {
  private db: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.db = prisma;
  }

  public async registar(nome: string, usuario: string, senhaPlana: string, permissao: string, email?: string) {
    const saltRounds = 12;
    const senhaHash = await bcrypt.hash(senhaPlana, saltRounds);

    return await this.db.funcionario.create({
      data: {
        nome,
        usuario,
        senha: senhaHash,
        permissao,
        email
      },
      select: { id: true, nome: true, usuario: true, permissao: true, email: true }
    });
  }

  public async login(usuario: string, senhaPlana: string): Promise<string | null> {
    const funcionario = await this.db.funcionario.findUnique({ where: { usuario } });

    if (!funcionario) return null;

    const senhaValida = await bcrypt.compare(senhaPlana, funcionario.senha);
    if (!senhaValida) return null;

    const secret = process.env.JWT_SECRET || 'chave-super-secreta-aerocode-av3';
    return jwt.sign({ 
      id: funcionario.id, 
      nome: funcionario.nome, 
      permissao: funcionario.permissao,
      nivel: funcionario.permissao 
    }, secret, { expiresIn: '2h' });
  }

  public async listarFuncionarios() {
    return await this.db.funcionario.findMany({
      select: { id: true, nome: true, usuario: true, permissao: true, email: true }
    });
  }

  public async atualizarFuncionario(id: string, data: any) {
    const updateData: any = {
      nome: data.nome,
      usuario: data.usuario,
      permissao: data.permissao,
      email: data.email || null,
    };

    if (data.senha && data.senha.trim() !== '') {
      const saltRounds = 12;
      updateData.senha = await bcrypt.hash(data.senha, saltRounds);
    }

    return await this.db.funcionario.update({
      where: { id },
      data: updateData,
      select: { id: true, nome: true, usuario: true, permissao: true, email: true }
    });
  }

  public async excluirFuncionario(id: string) {
    const funcionario = await this.db.funcionario.findUnique({ where: { id } });
    if (funcionario?.usuario === 'admin') {
      throw new Error('Não é permitido excluir a conta do Super Administrador (admin).');
    }
    return await this.db.funcionario.delete({
      where: { id }
    });
  }
}