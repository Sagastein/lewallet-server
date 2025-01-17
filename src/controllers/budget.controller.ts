import { Request, Response } from "express";
import Budget from "../models/budget.model";

import { BudgetFor, RECORD_TYPES } from "@/Constants/data";
import moment from "moment";
import Account from "@/models/account.model";

// Assuming you have a Transaction model

export const getBudgets = async (req: Request, res: Response) => {
  try {
    const budgets = await Budget.find().populate("accounts", "name"); // Populate the 'accounts' field with 'name' field

    const result = await Promise.all(
      budgets.map(async (budget) => {
        const { _id, accounts, amount, startDate, endDate, budgetFor } = budget;

        // Fetch transactions within the given period and account type
        const transactions = await Account.find({
          date: { $gte: startDate, $lte: endDate },
          account: { $in: accounts?.map((acc) => acc._id) },
          type: budgetFor === "all_expense" ? "expense" : "income",
        });

        // Calculate the total amount spent or earned
        const totalAmount = transactions.reduce(
          (sum, transaction) => sum + transaction.initialAmount,
          0
        );

        // Calculate the remaining amount
        const remainingAmount = amount - totalAmount;

        // Check if the budget is exceeded
                const isExceeded = remainingAmount < 0;
                const accountName = (budget.accounts?.[0] as any)?.name || budget.budgetFor;
                // Check if the budget is overdue
                const isOverdue = moment().isAfter(moment(endDate));

        return {
          _id,
          accounts,
          amount,
          startDate,
          endDate,
          budgetFor,
          accountName,
          remainingAmount,
          isExceeded,
          isOverdue,
        };
      })
    );

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getBudget = async (req: Request, res: Response) => {
  try {
    const budget = await Budget.findById(req.params.id);
    if (!budget) return res.status(404).json({ message: "Budget not found" });
    res.json(budget);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createBudget = async (req: Request, res: Response) => {
  const { name, amount, type, budgetFor, startDate, endDate, accounts } =
    req.body;

  // Validate the budgetFor field
  if (!Object.values(BudgetFor).includes(budgetFor)) {
    return res.status(400).json({ message: "Invalid budgetFor value" });
  }

  // Validate the accounts field if budgetFor is specific_accounts
  if (
    budgetFor === BudgetFor.SPECIFIC_ACCOUNTS &&
    (!accounts || accounts.length === 0)
  ) {
    return res.status(400).json({
      message: "Accounts are required for specific_accounts budgetFor value",
    });
  }

  const budget = new Budget({
    name,
    amount,
    type,
    budgetFor,
    startDate,
    endDate,
    accounts: budgetFor === BudgetFor.SPECIFIC_ACCOUNTS ? accounts : undefined,
  });

  try {
    const newBudget = await budget.save();
    res.status(201).json(newBudget);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateBudget = async (req: Request, res: Response) => {
  try {
    const budget = await Budget.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!budget) return res.status(404).json({ message: "Budget not found" });
    res.json(budget);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteBudget = async (req: Request, res: Response) => {
  try {
    const budget = await Budget.findByIdAndDelete(req.params.id);
    if (!budget) return res.status(404).json({ message: "Budget not found" });
    res.json({ message: "Budget deleted" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
