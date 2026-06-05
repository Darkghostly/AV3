import { Request, Response } from 'express';
import { ITesteService } from '../interfaces/ITesteService';

export class TesteController {
  private service: ITesteService;

  constructor(service: ITesteService) {
    this.service = service;
  }

  public listar = async (req: Request, res: Response): Promise<void> => {
    try {
      const testes = await this.service.listarTestes();
      res.status(200).json(testes);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao buscar testes.' });
    }
  };

  public criar = async (req: Request, res: Response): Promise<void> => {
    try {
      const teste = await this.service.criarTeste(req.body);
      res.status(201).json(teste);
    } catch (error: any) {
      res.status(400).json({ erro: error.message });
    }
  };

  public atualizar = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const teste = await this.service.atualizarTeste(id, req.body);
      res.status(200).json(teste);
    } catch (error: any) {
      res.status(400).json({ erro: error.message });
    }
  };

  public excluir = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.service.excluirTeste(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ erro: error.message });
    }
  };
}
