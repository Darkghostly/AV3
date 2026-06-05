import { PrismaClient } from '@prisma/client';
import { ITesteService } from '../interfaces/ITesteService';

export class TesteService implements ITesteService {
  private readonly db: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.db = prisma;
  }

  public async listarTestes() {
    return await this.db.teste.findMany();
  }

  public async criarTeste(data: any) {
    if (!data.codigo || !data.aeronaveId || !data.tipo) {
      throw new Error('Código, tipo e aeronaveId são obrigatórios.');
    }
    return await this.db.teste.create({
      data: {
        codigo: data.codigo,
        tipo: data.tipo,
        data: data.data || null,
        responsavel: data.responsavel || null,
        resultado: data.resultado || 'APROVADO',
        aeronaveId: data.aeronaveId
      }
    });
  }

  public async atualizarTeste(id: string, data: any) {
    return await this.db.teste.update({
      where: { id },
      data: {
        codigo: data.codigo,
        tipo: data.tipo,
        data: data.data,
        responsavel: data.responsavel,
        resultado: data.resultado,
        aeronaveId: data.aeronaveId
      }
    });
  }

  public async excluirTeste(id: string) {
    return await this.db.teste.delete({
      where: { id }
    });
  }
}
