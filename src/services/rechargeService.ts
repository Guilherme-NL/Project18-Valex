import joi from "joi";

async function amountValidation(amount: number) {
  //JOI VALIDATION
  const { error } = joi.number().min(1).required().validate(amount);

  if (error) {
    throw {
      code: 406,
      type: "Not acceptable",
      message: "Recharge value must be greater than 0",
    };
  }

  return "Amount accepted!";
}

export { amountValidation };
