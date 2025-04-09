import express from "express";
import helmet from "helmet";
import morgan from "morgan";

require("dotenv").config();

import MessageResponse from "./interfaces/MessageResponse";

// Middlewares
import * as middlewares from "./middlewares";

// Routers
import receiptsRouter from "./routes/receipts";

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());

app.get<{}, MessageResponse>("/", (req, res) => {
  res.json({
    message: "Receipts Processing Service is running",
  });
});

app.use("/receipts", receiptsRouter);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
