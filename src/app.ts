import express from "express";
import cors from "cors";
import { router } from "./routes/routes";

export const app = express();
export const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use("/", router);
