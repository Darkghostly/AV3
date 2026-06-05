import { Request, Response } from 'express';
import { IFuncionarioService } from '../interfaces/IFuncionarioService';

export class FuncionarioController {
  private service: IFuncionarioService;

  constructor(service: IFuncionarioService) {
    this.service = service;
  }

  public handleRegisto = async (
    req: Request, 
    res: Response
  ): Promise<void> => {
    try {
      const { nome, usuario, senha, permissao, email } = req.body;
      const novoFuncionario = await this.service.registar(nome, usuario, senha, permissao, email);
      res.status(201).json(novoFuncionario);
    } catch (error: any) {
      console.error("[ERRO DE REGISTRO]:", error); 
      res.status(400).json({ erro: 'Falha ao registar funcionário. Verifique os dados.' });
    }
  };

  public handleLogin = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { usuario, senha } = req.body;
      const token = await this.service.login(usuario, senha);

      if (!token) {
        res.status(401).json({ erro: 'Credenciais inválidas.' });
        return;
      }

      res.status(200).json({ mensagem: 'Login bem-sucedido', token });
    } catch (error) {
      console.error("[CRASH DO COFRE]:", error);
      res.status(500).json({ erro: 'Erro interno do servidor.' });
    }
  };

  public handleListar = async (req: Request, res: Response): Promise<void> => {
    try {
      const funcionarios = await this.service.listarFuncionarios();
      res.status(200).json(funcionarios);
    } catch (error) {
      console.error("[ERRO AO LISTAR FUNCIONÁRIOS]:", error);
      res.status(500).json({ erro: 'Erro ao buscar funcionários.' });
    }
  };

  public handleAtualizar = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const funcionario = await this.service.atualizarFuncionario(id, req.body);
      res.status(200).json(funcionario);
    } catch (error: any) {
      console.error("[ERRO AO ATUALIZAR FUNCIONÁRIO]:", error);
      res.status(400).json({ erro: error.message || 'Falha ao atualizar funcionário.' });
    }
  };

  public handleExcluir = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.service.excluirFuncionario(id);
      res.status(204).send();
    } catch (error: any) {
      console.error("[ERRO AO EXCLUIR FUNCIONÁRIO]:", error);
      res.status(400).json({ erro: error.message || 'Falha ao excluir funcionário.' });
    }
  };
}