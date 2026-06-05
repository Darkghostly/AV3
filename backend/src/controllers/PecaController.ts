import { Request, Response } from 'express';
import { IPecaService } from '../interfaces/IPecaService';

export class PecaController {
  private service: IPecaService;

  constructor(service: IPecaService) {
    this.service = service;
  }

  public listar = async (req: Request, res: Response): Promise<void> => {
    try {
      const pecas = await this.service.listarPecas();
      res.status(200).json(pecas);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao buscar peças.' });
    }
  };

  public criar = async (req: Request, res: Response): Promise<void> => {
    try {
      const peca = await this.service.criarPeca(req.body);
      res.status(201).json(peca);
    } catch (error: any) {
      res.status(400).json({ erro: error.message });
    }
  };

  public atualizar = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const peca = await this.service.atualizarPeca(id, req.body);
      res.status(200).json(peca);
    } catch (error: any) {
      res.status(400).json({ erro: error.message });
    }
  };

  public excluir = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.service.excluirPeca(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ erro: error.message });
    }
  };
}
