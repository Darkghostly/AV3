export interface ITesteService {
  listarTestes(): Promise<any[]>;
  criarTeste(data: any): Promise<any>;
  atualizarTeste(id: string, data: any): Promise<any>;
  excluirTeste(id: string): Promise<any>;
}
