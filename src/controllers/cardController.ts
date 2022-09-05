import { Request, Response } from "express";
import joi from "joi";
import {
  cardName,
  getCVCNumber,
  getCardNumber,
  cardExpiration,
  cardTypeValidation,
  cardValidation,
  validBlock,
  validNoBlock,
  CVCValidation,
  passwordValidation,
  cardUpdate,
  cardBalance,
  passwordVerification,
  passwordCrypt,
  employeeValidation,
} from "../services/cardService.js";
import { findByCardId as findPayments } from "../repositories/paymentRepository.js";
import { findByCardId as findRecharges } from "../repositories/rechargeRepository.js";
import { insert, update } from "../repositories/cardRepository.js";

async function cardCreation(req: Request, res: Response) {
  const { id, type } = req.body;

  //JOI VALIDATION
  const dataSchema = joi.object({
    id: joi.number().required(),
    type: joi
      .string()
      .regex(/^(groceries|restaurants|transport|education|health)$/)
      .required(),
  });

  const { error } = dataSchema.validate(req.body);

  if (error) {
    res.sendStatus(422);
    return;
  }

  try {
    const employee = await employeeValidation(id);
    await cardTypeValidation(id, type);

    const shortName = await cardName(employee.fullName);
    let cardNumber = await getCardNumber();
    const CVCNumberCrypt = await getCVCNumber();
    const expirationDate = await cardExpiration();

    const cardData = {
      employeeId: Number(employee.id),
      number: cardNumber,
      cardholderName: shortName,
      securityCode: CVCNumberCrypt,
      expirationDate,
      isVirtual: true,
      isBlocked: true,
      type,
    };

    await insert(cardData);

    res.sendStatus(200);
  } catch (err) {
    if (err.code) {
      res.status(err.code).send(err.message);
    }
  }
}

async function cardActivation(req: Request, res: Response) {
  const { id, CVC, password } = req.body;

  try {
    const card = await cardValidation(id);
    await validBlock(card.isBlocked);
    await CVCValidation(CVC, card.securityCode);
    await passwordValidation(password);
    const passwordHash = await passwordCrypt(password);

    const cardData = { password: passwordHash, isBlocked: false };
    await cardUpdate(id, cardData);

    res.sendStatus(200);
  } catch (err) {
    if (err.code) {
      res.status(err.code).send(err.message);
    }
  }
}

async function cardTransactions(req: Request, res: Response) {
  const { id } = req.params;
  const cardId = Number(id);
  console.log(cardId);
  try {
    await cardValidation(cardId);
    const transactions = await findPayments(cardId);
    const recharges = await findRecharges(cardId);
    const balance = await cardBalance(transactions, recharges);
    res.status(200).send({ balance, transactions, recharges });
  } catch (err) {
    if (err.code) {
      res.status(err.code).send(err.message);
    }
  }
}

async function cardBlock(req: Request, res: Response) {
  const { id, password } = req.body;
  try {
    const card = await cardValidation(id);
    await validNoBlock(card.isBlocked);
    await passwordVerification(password, card.password);

    const cardData = { isBlocked: true };

    await update(id, cardData);
    res.sendStatus(200);
  } catch (err) {
    if (err.code) {
      res.status(err.code).send(err.message);
    }
  }
}

async function cardUnlock(req: Request, res: Response) {
  const { id, password } = req.body;
  try {
    const card = await cardValidation(id);
    await validBlock(card.isBlocked);
    await passwordVerification(password, card.password);

    const cardData = { isBlocked: false };

    await update(id, cardData);
    res.sendStatus(200);
  } catch (err) {
    if (err.code) {
      res.status(err.code).send(err.message);
    }
  }
}

export {
  cardCreation,
  cardActivation,
  cardTransactions,
  cardBlock,
  cardUnlock,
};
