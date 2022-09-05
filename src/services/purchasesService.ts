import { findById } from "../repositories/businessRepository.js";

async function businessValidation(businessId: number) {
  const business = await findById(businessId);
  if (!business) {
    throw {
      code: 404,
      message: "The id does not match any registered bussines",
    };
  }

  return business;
}

async function businessTypeValidation(businessType: string, cardType: string) {
  if (businessType !== cardType) {
    throw {
      code: 401,
      message: "Card type different from business type",
    };
  }
}

async function amountLimitValidation(
  purchasesAmount: number,
  balanceAmount: number
) {
  if (purchasesAmount > balanceAmount) {
    throw {
      code: 401,
      message: "Insufficient limit to make the purchase",
    };
  }
  return "Limit approved!";
}

export { businessValidation, businessTypeValidation, amountLimitValidation };
