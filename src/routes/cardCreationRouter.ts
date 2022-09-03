import { Router } from "express";
import cardCreation from "../controllers/cardCreationController.js";
import {
  keyValidation,
  employeeValidation,
} from "../middlewares/cardCreationMiddleware.js";

const router = Router();

router.post("/creation", keyValidation, employeeValidation, cardCreation);

export default router;
