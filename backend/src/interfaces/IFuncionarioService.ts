export interface IFuncionarioService {
  registar (
    nome: string,
    usuario: string,
    senhaPlana: string,
    permissao: string,
    email?: string
  ): Promise<any>;
  login (
    usuario: string,
    senhaPlana: string
  ): Promise<string | null>;
  listarFuncionarios(): Promise<any[]>;
  atualizarFuncionario(id: string, data: any): Promise<any>;
  excluirFuncionario(id: string): Promise<any>;
}