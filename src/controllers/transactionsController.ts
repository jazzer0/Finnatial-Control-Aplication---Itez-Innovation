import { Request, Response } from "express";
import prismaClient from "../config/prismaConfig";

class TransactionsController {
  async getAll(_req: Request, res: Response) {
    const transactions = await prismaClient.transactions.findMany();
    res.send({ data: transactions });
  }

  async create(req: Request, res: Response) {
    const data = {
      gastoNome: req.body.gastoNome,
      value: req.body.value,
      transactionType: req.body.transactionType,
      userId: req.body.userId,
      description: req.body.description,
    };
    try {
      await prismaClient.transactions.create({
        data: {
          gastoNome: data.gastoNome,
          value: data.value,
          transactionType: data.transactionType,
          userId: data.userId,
          description: data.description,
        },
      });
      return res.sendStatus(201);
    } catch (error) {
      return res.status(500).send({
        error: true,
        message: error,
      });
    }
  }

  async edit(req: Request, res: Response) {
    const transactionsId = req.params.id;
    const data = {
      gastoNome: req.body.gastoNome,
      value: req.body.value,
      transactionType: req.body.transactionType,
      description: req.body.description,
    };

    try {
      await prismaClient.transactions.update({
        where: { id: transactionsId },
        data,
      });
      return res.sendStatus(200);
    } catch (error) {
      return res.status(500).send({
        error: true,
        message: error,
      });
    }
  }
  async delete(req: Request, res: Response) {
    const transactionsId = req.params.id;

    if (!transactionsId) {
      return res.status(400).send({
        error: true,
        message: "id is mandatory",
      });
    }

    try {
      await prismaClient.transactions.delete({
        where: {
          id: transactionsId,
        },
      });

      return res.status(204).send();
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        error: true,
        message: error,
      });
    }
  }
}

export default new TransactionsController();
