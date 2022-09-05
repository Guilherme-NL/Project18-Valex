import { Router } from "express";
import cardPurchases from "../controllers/purchasesController.js";

const router = Router();

router.post("/purchase", cardPurchases);

export default router;
