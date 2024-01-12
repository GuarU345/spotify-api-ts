import express from "express";
import cors from "cors";
import morgan from "morgan";
import { router } from "./routes/routes";
import { handleError } from "./middlewares/errors";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../libs/swagger-output.json";

export const app = express();
export const PORT = process.env.PORT ?? 3000;

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/", router);
app.use(handleError);
