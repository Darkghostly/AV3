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
      const { nome, usuario, senha, permissao } = req.body;
      const novoFuncionario = await this.service.registar(nome, usuario, senha, permissao);
      res.status(201).json(novoFuncionario);
    } catch (error: any) {
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
      res.status(500).json({ erro: 'Erro interno do servidor.' });
    }
  };
}