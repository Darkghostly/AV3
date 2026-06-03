export interface IAeronaveService {
  criarAeronave(
    modelo: string, 
    fabricante: string
  ): Promise<any>;
  listarAeronaves(): Promise<any[]>;
}