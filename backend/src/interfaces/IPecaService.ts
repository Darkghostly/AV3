export interface IPecaService {
  listarPecas(): Promise<any[]>;
  criarPeca(data: any): Promise<any>;
  atualizarPeca(id: string, data: any): Promise<any>;
  excluirPeca(id: string): Promise<any>;
}
