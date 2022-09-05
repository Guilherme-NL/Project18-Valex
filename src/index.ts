import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import card from "./routes/cardRouter.js";
import recharge from "./routes/rechargeRouter.js";
import purchase from "./routes/purchasesRouter.js";

dotenv.config();

const app = express();

app.use(cors(), express.json(), card, recharge, purchase);

const PORT = process.env.PORT;
app.listen(PORT);
