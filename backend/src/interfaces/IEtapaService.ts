export interface IEtapaService {
  listarEtapas(): Promise<any[]>;
  criarEtapa(data: any): Promise<any>;
  atualizarEtapa(id: string, data: any): Promise<any>;
  excluirEtapa(id: string): Promise<any>;
}
