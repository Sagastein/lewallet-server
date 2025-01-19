import { Router } from "express";
import {
  getAccounts,
  getAccount,
  createAccount,
  updateAccount,
  deleteAccount,
  getAccountDetailsWithRecords,
} from "../controllers/account.controller";

const route = Router();

route.get("/", getAccounts);
route.get("/:id", getAccount);
route.post("/", createAccount);
route.put("/:id", updateAccount);
route.delete("/:id", deleteAccount);
route.get("/:accountId/details", getAccountDetailsWithRecords);

export { route as accountRoute };
