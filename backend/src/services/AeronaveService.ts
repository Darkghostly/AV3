import { PrismaClient } from '@prisma/client';
import { IAeronaveService } from '../interfaces/IAeronaveService';

export class AeronaveService implements IAeronaveService {
  private readonly db: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.db = prisma;
  }

  public async criarAeronave(
    modelo: string,
    fabricante: string
  ) {
    if (!modelo || !fabricante) {
      throw new Error('Modelo e fabricante são obrigatórios.');
    }
    return await this.db.aeronave.create({ data: { modelo, fabricante } });
  }

  public async listarAeronaves() {
    return await this.db.aeronave.findMany();
  }
}