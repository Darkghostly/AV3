import { Request, Response } from 'express';
import { IAeronaveService } from '../interfaces/IAeronaveService';

export class AeronaveController {
  private service: IAeronaveService;

  constructor(service: IAeronaveService) {
    this.service = service;
  }

  public criar = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const aeronave = await this.service.criarAeronave(req.body);
      res.status(201).json(aeronave);
    } catch (error: any) {
      res.status(400).json({ erro: error.message });
    }
  };

  public listar = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const aeronaves = await this.service.listarAeronaves();
      res.status(200).json(aeronaves);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao buscar aeronaves.' });
    }
  };

  public atualizar = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const aeronave = await this.service.atualizarAeronave(id, req.body);
      res.status(200).json(aeronave);
    } catch (error: any) {
      res.status(400).json({ erro: error.message });
    }
  };

  public excluir = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;
      await this.service.excluirAeronave(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ erro: error.message });
    }
  };
}