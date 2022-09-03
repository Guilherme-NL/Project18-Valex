import {
  findByTypeAndEmployeeId,
  TransactionTypes,
} from "../repositories/cardRepository.js";
import { faker } from "@faker-js/faker";
import Cryptr from "cryptr";

async function cardTypeValidation(id: number, type: TransactionTypes) {
  const employeeCard = findByTypeAndEmployeeId(type, id);
  if (employeeCard) {
    throw { code: 409, message: "The employee already has this type of card" };
  }
  return "All right, the employee still does not have this type of card";
}

async function getCardNumber() {
  const cardNumber: string = faker.finance.account(16);
  console.log(cardNumber);
  return cardNumber;
}

async function getCVCNumber() {
  const CVCNumber: string = faker.finance.account(3);
  const cryptr = new Cryptr("myTotallySecretKey");
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

export {
  cardTypeValidation,
  getCardNumber,
  cardName,
  cardExpiration,
  getCVCNumber,
};
