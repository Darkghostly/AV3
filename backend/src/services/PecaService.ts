import { PrismaClient } from '@prisma/client';
import { IPecaService } from '../interfaces/IPecaService';

export class PecaService implements IPecaService {
  private readonly db: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.db = prisma;
  }

  public async listarPecas() {
    return await this.db.peca.findMany();
  }

  public async criarPeca(data: any) {
    if (!data.codigo || !data.nome) {
      throw new Error('Código e nome são obrigatórios.');
    }
    return await this.db.peca.create({
      data: {
        codigo: data.codigo,
        nome: data.nome,
        tipo: data.tipo || 'NACIONAL',
        fornecedor: data.fornecedor || null,
        status: data.status || 'EM_PRODUCAO',
        aeronaveId: data.aeronaveId || null
      }
    });
  }

  public async atualizarPeca(id: string, data: any) {
    return await this.db.peca.update({
      where: { id },
      data: {
        codigo: data.codigo,
        nome: data.nome,
        tipo: data.tipo,
        fornecedor: data.fornecedor,
        status: data.status,
        aeronaveId: data.aeronaveId || null
      }
    });
  }

  public async excluirPeca(id: string) {
    return await this.db.peca.delete({
      where: { id }
    });
  }
}
