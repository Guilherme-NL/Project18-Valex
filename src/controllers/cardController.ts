import { Request, Response } from "express";
import joi from "joi";
import {
  cardName,
  getCVCNumber,
  getCardNumber,
  cardExpiration,
  cardTypeValidation,
  cardValidation,
  CVCValidation,
  passwordValidation,
  cardUpdate,
  cardBalance,
} from "../services/cardService.js";
import { findByCardId } from "../repositories/paymentRepository.js";
import { insert } from "../repositories/cardRepository.js";

async function cardCreation(req: Request, res: Response) {
  const { id, type } = req.body;

  //JOI VALIDATION
  const dataSchema = joi.object({
    id: joi.string().required(),
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
    await cardTypeValidation(id, type);

    const employee = res.locals.employee;

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
    await CVCValidation(CVC, card.securityCode);
    const passwordHash = await passwordValidation(password);

    const cardData = { passwordHash, isBlocked: false };
    await cardUpdate(id, cardData);

    res.sendStatus(200);
  } catch (err) {
    if (err.code) {
      res.status(err.code).send(err.message);
    }
  }
}

async function cardTransactions(req: Request, res: Response) {
  const id = Number(req.params);
  try {
    const transactions = await findByCardId(id);
    const balance = cardBalance(transactions);
    res.status(200).send({ balance, transactions });
  } catch {
    res.sendStatus(500);
  }
}

export { cardCreation, cardActivation, cardTransactions };
