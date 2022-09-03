import { Request, Response } from "express";
import joi from "joi";
import {
  cardName,
  getCVCNumber,
  getCardNumber,
  cardExpiration,
  cardTypeValidation,
} from "../services/cardCreationService.js";
import { insert } from "../repositories/cardRepository.js";

export default async function cardCreation(req: Request, res: Response) {
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
  } catch {
    res.sendStatus(500);
  }
}
