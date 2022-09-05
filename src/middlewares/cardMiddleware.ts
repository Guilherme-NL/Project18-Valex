import { Request, Response, NextFunction } from "express";
import { findByApiKey } from "../repositories/companyRepository.js";

async function keyValidation(req: Request, res: Response, next: NextFunction) {
  const apiKey: string = req.header("Authorization").replace("Bearer ", "");
  const company = await findByApiKey(apiKey);

  if (!company) {
    return res.status(404).send("API-Key does not belong to any company");
  }

  res.locals.company = company;

  next();
}

export { keyValidation };
