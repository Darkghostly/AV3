import { PrismaClient } from '@prisma/client';
import { IEtapaService } from '../interfaces/IEtapaService';

export class EtapaService implements IEtapaService {
  private readonly db: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.db = prisma;
  }

  public async listarEtapas() {
    return await this.db.etapa.findMany();
  }

  public async criarEtapa(data: any) {
    if (!data.nome || !data.aeronaveId) {
      throw new Error('Nome e aeronaveId são obrigatórios.');
    }
    if (data.responsavel) {
      const funcionarioExists = await this.db.funcionario.findFirst({
        where: { nome: data.responsavel }
      });
      if (!funcionarioExists) {
        throw new Error('O responsável selecionado deve ser um funcionário cadastrado.');
      }
    }
    return await this.db.etapa.create({
      data: {
        nome: data.nome,
        prazo: data.prazo || null,
        responsavel: data.responsavel || null,
        status: data.status || 'PENDENTE',
        aeronaveId: data.aeronaveId
      }
    });
  }

  public async atualizarEtapa(id: string, data: any) {
    if (data.responsavel) {
      const funcionarioExists = await this.db.funcionario.findFirst({
        where: { nome: data.responsavel }
      });
      if (!funcionarioExists) {
        throw new Error('O responsável selecionado deve ser um funcionário cadastrado.');
      }
    }
    return await this.db.etapa.update({
      where: { id },
      data: {
        nome: data.nome,
        prazo: data.prazo,
        responsavel: data.responsavel,
        status: data.status,
        aeronaveId: data.aeronaveId
      }
    });
  }

  public async excluirEtapa(id: string) {
    return await this.db.etapa.delete({
      where: { id }
    });
  }
}
