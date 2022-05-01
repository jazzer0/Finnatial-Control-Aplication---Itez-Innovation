import { Request, Response } from "express";
import prismaClient from "../config/prismaConfig";

class TransactionsController {
  async getAll(_req: Request, res: Response) {
    const transactions = await prismaClient.transactions.findMany();
    res.send({ data: transactions });
  }

  async create(req: Request, res: Response) {
    const data = {
      areaDeGasto: req.body.areaDeGasto?.toLowerCase(),
      value: Math.abs(req.body.value),
      transactionType: req.body.transactionType?.toLowerCase(),
      userId: req.body.userId,
      description: req.body.description,
    };
    if (
      data.areaDeGasto &&
      ![
        "entretenimento",
        "alimentação",
        "educação",
        "saúde",
        "transporte",
      ].includes(data.areaDeGasto)
    ) {
      return res.status(400).json({
        error: true,
        message:
          "Área de Gasto inválida.Áreas válidas: [entretenimento,alimentação,educação,saúde e transporte]",
      });
    }

    if (!["gasto", "ganho"].includes(data.transactionType)) {
      return res.status(400).json({
        error: true,
        message: "Tipo de transação inválida.Tipos válidos: [gasto,ganho]",
      });
    }

    try {
      await prismaClient.transactions.create({
        data: {
          areaDeGasto: data.areaDeGasto,
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
      areaDeGasto: req.body.areaDeGasto,
      value: Math.abs(req.body.value),
      transactionType: req.body.transactionType,
      description: req.body.description,
    };
    if (
      ![
        "entretenimento",
        "alimentação",
        "educação",
        "saúde",
        "transporte",
      ].includes(data.areaDeGasto)
    ) {
      return res.status(400).json({
        error: true,
        message:
          "Área de Gasto inválida.Áreas válidas: [entretenimento,alimentação,educação,saúde e transporte]",
      });
    }

    if (!["gasto", "ganho"].includes(data.transactionType)) {
      return res.status(400).json({
        error: true,
        message: "Tipo de transação inválida.Tipos válidos: [gasto,ganho]",
      });
    }

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

  async extrato(_req: Request, res: Response) {
    const transactions = await prismaClient.transactions.findMany();
    let saldo = 0,
      ganhos = 0,
      gastosTotais = 0;

    let registroGastos: any = [];

    transactions.forEach((transactions) => {
      if (transactions.transactionType === "ganho") {
        ganhos += transactions.value;
        saldo += transactions.value;
      } else {
        registroGastos.push({
          "Tipo de Gasto": transactions.areaDeGasto,
          Valor: transactions.value,
        });
        gastosTotais += transactions.value;
        saldo -= transactions.value;
      }
    });
    return res.status(200).json({
      saldo,
      ganhos,
      gastosTotais,
      registroGastos,
    });
  }
}

export default TransactionsController;
