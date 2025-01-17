import express from "express";
import {
  getCurrencies,
  getCurrency,
  createCurrency,
  updateCurrency,
  deleteCurrency,
} from "../controllers/currency.controller";

const router = express.Router();

router.get("/", getCurrencies);
router.get("/:id", getCurrency);
router.post("/", createCurrency);
router.put("/:id", updateCurrency);
router.delete("/:id", deleteCurrency);

export { router as currencyRoute };
