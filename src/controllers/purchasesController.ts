import { Request, Response } from "express";
import { amountValidation } from "../services/rechargeService.js";
import {
  cardValidation,
  validNoBlock,
  passwordVerification,
  cardBalance,
} from "../services/cardService.js";
import {
  businessValidation,
  businessTypeValidation,
  amountLimitValidation,
} from "../services/purchasesService.js";
import { insert } from "../repositories/paymentRepository.js";
import { findByCardId as findPayments } from "../repositories/paymentRepository.js";
import { findByCardId as findRecharges } from "../repositories/rechargeRepository.js";

export default async function cardPurchases(req: Request, res: Response) {
  const { cardId, password, businessId, amount } = req.body;
  try {
    await amountValidation(amount);
    const card = await cardValidation(cardId);
    await validNoBlock(card.isBlocked);
    await passwordVerification(password, card.password);
    const business = await businessValidation(businessId);
    await businessTypeValidation(business.type, card.type);
    const transactions = await findPayments(cardId);
    const recharges = await findRecharges(cardId);
    const balance = await cardBalance(transactions, recharges);
    console.log(balance);
    await amountLimitValidation(amount, balance);

    const paymentData = { cardId, businessId, amount };
    await insert(paymentData);
    res.sendStatus(200);
  } catch (err) {
    if (err.code) {
      res.status(err.code).send(err.message);
    }
  }
}
