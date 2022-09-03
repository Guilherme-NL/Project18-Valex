import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import creation from "./routes/cardCreationRouter.js";

dotenv.config();

const app = express();

app.use(cors(), express.json(), creation);

const PORT = process.env.PORT;
app.listen(PORT);
