import { Router } from "express";
import {
  createRecord,
  deleteRecord,
  getRecord,
  getRecords,
  updateRecord,
  recentRecord,
  cashFlowTrend,
  getSummary,
} from "../controllers/record.controller";
const router = Router();

router.get("/", getRecords);
router.get("/recent", recentRecord);
router.get("/cashflow", cashFlowTrend);
router.get("/stats", getSummary);
router.get("/:id", getRecord);
router.post("/", createRecord);
router.put("/:id", updateRecord);
router.delete("/:id", deleteRecord);

export { router as recordRoute };
