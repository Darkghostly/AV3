import { Request, Response } from 'express';
import { IEtapaService } from '../interfaces/IEtapaService';

export class EtapaController {
  private service: IEtapaService;

  constructor(service: IEtapaService) {
    this.service = service;
  }

  public listar = async (req: Request, res: Response): Promise<void> => {
    try {
      const etapas = await this.service.listarEtapas();
      res.status(200).json(etapas);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao buscar etapas.' });
    }
  };

  public criar = async (req: Request, res: Response): Promise<void> => {
    try {
      const etapa = await this.service.criarEtapa(req.body);
      res.status(201).json(etapa);
    } catch (error: any) {
      res.status(400).json({ erro: error.message });
    }
  };

  public atualizar = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const etapa = await this.service.atualizarEtapa(id, req.body);
      res.status(200).json(etapa);
    } catch (error: any) {
      res.status(400).json({ erro: error.message });
    }
  };

  public excluir = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.service.excluirEtapa(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ erro: error.message });
    }
  };
}
