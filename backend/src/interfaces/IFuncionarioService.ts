export interface IFuncionarioService {
  registar (
    nome: string,
    usuario: string,
    senhaPlana: string,
    permissao: string
  ): Promise<any>;
  login (
    usuario: string,
    senhaPlana: string
  ): Promise<string | null>;
}