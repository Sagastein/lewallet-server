import express from "express";
import { logger, connectDB } from "@/config";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();
app.use(express.json());
app.use(cookieParser());
const PORT = process.env.PORT || 3000;
const apiRouter = express.Router();
app.use(cors());
app.use("/v1/api", apiRouter);
app.get("/", (_, res) => {
  res.send("welcome to Lewallet API");
});
app.all("*", (_, res) => {
  res.status(404).json({ message: "Route not found" });
});

//check db connected and start server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`Server started on port ${PORT}`);
    });
  })
  .catch((error) => {
    logger.error("Error connecting to database", error);
    process.exit(1);
  });
