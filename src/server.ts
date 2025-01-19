import express from "express";
import { logger, connectDB } from "@/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import { accountRoute, budgetRoute, currencyRoute } from "./routes";
import { recordRoute } from "./routes/record.route";

const app = express();
const PORT = process.env.PORT || 3000;

// Apply middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
// Define API routes
const apiRouter = express.Router();
apiRouter.use("/account", accountRoute);
apiRouter.use("/budget", budgetRoute);
apiRouter.use("/currency", currencyRoute);
apiRouter.use("/record", recordRoute);

// Prefix all routes with /v1/api
app.use("/v1/api", apiRouter);

// Welcome route
app.get("/", (_, res) => {
  res.send("Welcome to Lewallet API");
});

// 404 Not Found route
app.all("*", (_, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Check DB connection and start server
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
