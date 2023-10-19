import express from "express";
import cors from "cors";
import morgan from "morgan";
import { router } from "./routes/routes";
import { handleError } from "./middlewares/errors";

export const app = express();
export const PORT = process.env.PORT ?? 3000;

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use("/", router);
app.use(handleError);
