import express from "express"
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors(), express.json());

const PORT = process.env.PORT;
app.listen(PORT);