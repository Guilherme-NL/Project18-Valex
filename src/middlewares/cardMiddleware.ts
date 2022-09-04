import { Request, Response, NextFunction } from "express";
import { findByApiKey } from "../repositories/companyRepository.js";
import { findById } from "../repositories/employeeRepository.js";

async function keyValidation(req: Request, res: Response, next: NextFunction) {
  const apiKey: string = req.header("Authorization").replace("Bearer ", "");
  const company = await findByApiKey(apiKey);

  if (!company) {
    return res.status(404).send("API-Key does not belong to any company");
  }

  res.locals.company = company;

  next();
}

async function employeeValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const id = req.body.id;
  const employee = await findById(id);

  if (!employee) {
    return res.status(404).send("There is no employee registered with this id");
  }

  res.locals.employee = employee;

  next();
}

export { keyValidation, employeeValidation };
