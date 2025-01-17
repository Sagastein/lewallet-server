import express from "express";
import {
  getBudgets,
  getBudget,
  createBudget,
  updateBudget,
  deleteBudget,
} from "../controllers/budget.controller";

const router = express.Router();

router.get("/", getBudgets);
router.get("/:id", getBudget);
router.post("/", createBudget);
router.put("/:id", updateBudget);
router.delete("/:id", deleteBudget);

export { router as budgetRoute };
