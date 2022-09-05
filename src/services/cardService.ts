import joi from "joi";
import {
  findByTypeAndEmployeeId,
  TransactionTypes,
  findById,
  update,
  CardUpdateData,
} from "../repositories/cardRepository.js";
import { findById as findEmployee } from "../repositories/employeeRepository.js";
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";
import Cryptr from "cryptr";

const cryptr = new Cryptr("myTotallySecretKey");

async function cardTypeValidation(id: number, type: TransactionTypes) {
  console.log(id, type);
  const employeeCard = await findByTypeAndEmployeeId(type, id);
  console.log(employeeCard);
  if (employeeCard) {
    throw { code: 409, message: "The employee already has this type of card" };
  }
  return "All right, the employee still does not have this type of card";
}

async function employeeValidation(id: number) {
  const employee = await findEmployee(id);

  if (!employee) {
    throw {
      code: 404,
      message: "There is no employee registered with this id",
    };
  }
  return employee;
}

async function getCardNumber() {
  const cardNumber: string = faker.finance.account(16);
  console.log(cardNumber);
  return cardNumber;
}

async function getCVCNumber() {
  const CVCNumber: string = faker.finance.account(3);
  console.log(CVCNumber);
  const encryptedCVCNumber = cryptr.encrypt(CVCNumber);
  return encryptedCVCNumber;
}

async function cardName(name: string) {
  const splitName = name.split(" ");
  if (splitName.length >= 3) {
    for (let i = 1; i < splitName.length - 1; i++) {
      if (splitName[i].length > 3) {
        splitName[i] = splitName[i].charAt(0) + ".";
      }
    }
  }
  return splitName.join(" ").toUpperCase();
}

async function cardExpiration() {
  const data = new Date();
  const day = String(data.getDate()).padStart(2, "0");
  const month = String(data.getMonth() + 1).padStart(2, "0");
  const year = Number(data.getFullYear());
  const expirationYear = year - 2000 + 5;
  const expirationDate = month + "/" + expirationYear;

  return expirationDate;
}

async function cardValidation(id: number) {
  const card = await findById(id);
  if (!card) {
    throw { code: 404, message: "This id does not match any registered card" };
  }

  const today = new Date().toLocaleDateString();
  if (Date.parse("01/" + card.expirationDate) < Date.parse(today)) {
    throw { code: 401, message: "The card date has expired!" };
  }

  return card;
}

async function validBlock(isBlocked: boolean) {
  if (isBlocked === false) {
    throw { code: 409, message: "The card is already activated!" };
  }
  return "Card activated!";
}

async function validNoBlock(isBlocked: boolean) {
  if (isBlocked === true) {
    throw { code: 409, message: "The card is already blocked!" };
  }
  return "Card blocked!";
}

async function CVCValidation(CVC: string, CVCcrypt: string) {
  if (CVC !== cryptr.decrypt(CVCcrypt)) {
    throw { code: 401, type: "Unauthorized", message: "Wrong CVC number" };
  }
  return "CVC ok!";
}

async function passwordValidation(password: string) {
  //JOI VALIDATION
  const { error } = joi
    .string()
    .length(4)
    .pattern(/^[0-9]+$/)
    .required()
    .validate(password);

  if (error) {
    throw {
      code: 406,
      type: "Not acceptable",
      message: "Password must be 4 numeric digits",
    };
  }
  return "password ok!";
}

async function passwordCrypt(password: string) {
  const passwordHash = bcrypt.hashSync(password, 10);
  return passwordHash;
}

async function passwordVerification(password: string, passwordCrypt: string) {
  const comparePassword = bcrypt.compareSync(password, passwordCrypt);
  if (!comparePassword) {
    throw { code: 401, message: "The password is incorrect!" };
  }
  return "passwords match!";
}

async function cardUpdate(id: number, cardData: CardUpdateData) {
  update(id, cardData);
}

async function cardBalance(transactions: any, recharges: any) {
  let balance = 0;
  recharges.map((e: any) => {
    balance += e.amount;
  });
  transactions.map((e: any) => {
    balance -= e.amount;
  });

  return balance;
}

export {
  cardTypeValidation,
  cardValidation,
  validBlock,
  validNoBlock,
  getCardNumber,
  cardName,
  cardExpiration,
  getCVCNumber,
  CVCValidation,
  passwordValidation,
  passwordCrypt,
  cardUpdate,
  cardBalance,
  passwordVerification,
  employeeValidation,
};
