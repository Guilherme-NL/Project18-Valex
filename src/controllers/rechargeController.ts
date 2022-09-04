import { Request, Response } from "express";
import { amountValidation } from "../services/rechargeService.js";
import { cardValidation, validNoBlock } from "../services/cardService.js";
import { insert } from "../repositories/rechargeRepository.js";

export default async function cardRecharge(req: Request, res: Response) {
  const { id, amount } = req.body;

  try {
    await amountValidation(amount);
    const card = await cardValidation(id);
    await validNoBlock(card.isBlocked);

    const rechargeData = { cardId: id, amount };
    await insert(rechargeData);
    res.sendStatus(200);
  } catch (err) {
    if (err.code) {
      res.status(err.code).send(err.message);
    }
  }
}
