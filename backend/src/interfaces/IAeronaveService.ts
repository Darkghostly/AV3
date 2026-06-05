export interface IAeronaveService {
  criarAeronave(data: any): Promise<any>;
  listarAeronaves(): Promise<any[]>;
  atualizarAeronave(id: string, data: any): Promise<any>;
  excluirAeronave(id: string): Promise<any>;
}