import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import card from "./routes/cardRouter.js";

dotenv.config();

const app = express();

app.use(cors(), express.json(), card);

const PORT = process.env.PORT;
app.listen(PORT);
