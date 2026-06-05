import { PrismaClient } from '@prisma/client';
import { IAeronaveService } from '../interfaces/IAeronaveService';

export class AeronaveService implements IAeronaveService {
  private readonly db: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.db = prisma;
  }

  public async criarAeronave(data: any) {
    // Agora exigimos o código, que é obrigatório no schema do Prisma
    if (!data.modelo || !data.fabricante || !data.codigo) {
      throw new Error('Código, modelo e fabricante são obrigatórios.');
    }
    
    return await this.db.aeronave.create({ 
      data: { 
        codigo: data.codigo,
        modelo: data.modelo, 
        fabricante: data.fabricante,
        tipo: data.tipo || 'COMERCIAL',
        capacidade: data.capacidade ? String(data.capacidade) : null,
        alcance: data.alcance ? String(data.alcance) : null,
        status: data.status || 'PENDENTE'
      } 
    });
  }

  public async listarAeronaves() {
    return await this.db.aeronave.findMany();
  }

  public async atualizarAeronave(id: string, data: any) {
    return await this.db.aeronave.update({
      where: { id },
      data: {
        codigo: data.codigo,
        modelo: data.modelo,
        fabricante: data.fabricante,
        tipo: data.tipo,
        capacidade: data.capacidade ? String(data.capacidade) : null,
        alcance: data.alcance ? String(data.alcance) : null,
        status: data.status
      }
    });
  }

  public async excluirAeronave(id: string) {
    return await this.db.aeronave.delete({
      where: { id }
    });
  }
}