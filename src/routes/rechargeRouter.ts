import { Router } from "express";
import cardRecharge from "../controllers/rechargeController.js";
import { keyValidation } from "../middlewares/cardMiddleware.js";

const router = Router();

router.post("/recharge", keyValidation, cardRecharge);

export default router;
