import { Router } from "express";
import {
  cardCreation,
  cardActivation,
  cardTransactions,
  cardBlock,
  cardUnlock,
} from "../controllers/cardController.js";
import {
  keyValidation,
  employeeValidation,
} from "../middlewares/cardMiddleware.js";

const router = Router();

router.post("/creation", keyValidation, employeeValidation, cardCreation);
router.post("/activation", cardActivation);
router.get("/transactions/:id", cardTransactions);
router.post("/block", cardBlock);
router.post("/unlock", cardUnlock);

export default router;
