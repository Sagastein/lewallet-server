import { Request, Response } from "express";
import mongoose from "mongoose";
import Record from "../models/record.model";
import Account from "../models/account.model";
import Budget from "../models/budget.model";
import Notification from "../models/notification.model";

export const createRecord = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      type,
      amount,
      category,
      date,
      account,
      fromAccount,
      toAccount,
      payee,
      payer,
      paymentType,
      paymentStatus,
      note,
      location,
      label,
    } = req.body;

    const recordData = {
      type,
      amount,
      date,
      account,
      fromAccount,
      toAccount,
      payee,
      payer,
      paymentType,
      paymentStatus,
      note,
      location,
      ...(type !== "Transfer" && { category, label }),
    };

    const record = new Record(recordData);
    const transactionDate = new Date(date);
    const accountToCheck = type === "transfer" ? fromAccount : account;

    // Find active budgets
    const activeBudgets = await Budget.find({
      $or: [{ accounts: accountToCheck }, { accounts: { $size: 0 } }],
      startDate: { $lte: transactionDate },
      endDate: { $gte: transactionDate },
    }).session(session);

    // Fetch accounts involved in transaction
    const accounts = await Account.find({
      _id: { $in: [account, fromAccount, toAccount].filter((id) => id) },
    }).session(session);

    // Check sufficient funds
    if (type.toLowerCase() === "transfer") {
      const fromAccountDetails = accounts.find((acc) =>
        (acc._id as mongoose.Types.ObjectId).equals(fromAccount)
      );
      if (!fromAccountDetails || fromAccountDetails.currentBalance < amount) {
        throw new Error("Insufficient funds in the From Account");
      }
    } else if (type.toLowerCase() === "expense") {
      const expenseAccount = accounts.find((acc) =>
        (acc._id as mongoose.Types.ObjectId).equals(account)
      );
      if (!expenseAccount || expenseAccount.currentBalance < amount) {
        throw new Error("Insufficient funds for this expense");
      }
    }

    // Check budgets and create notifications if needed
    if (type.toLowerCase() === "expense") {
      for (const budget of activeBudgets) {
        const budgetStart = budget.startDate;
        const budgetEnd = budget.endDate;

        const totalSpending = await Record.aggregate([
          {
            $match: {
              date: { $gte: budgetStart, $lte: budgetEnd },
              type: "expense",
              $or: [
                { account: accountToCheck },
                ...(budget?.accounts?.length === 0 ? [{}] : []),
              ],
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$amount" },
            },
          },
        ]).session(session);

        const currentSpending = totalSpending[0]?.total || 0;
        if (currentSpending + amount > budget.amount) {
          const notification = new Notification({
            type: "BUDGET_EXCEEDED",
            title: `Budget Alert: ${budget.name}`,
            message: `Transaction of ${amount} exceeds budget limit of ${budget.amount}`,
            relatedBudget: budget._id,
            relatedAccount: accountToCheck,
            date: new Date(),
          });
          await notification.save({ session });
        }
      }
    }

    // Update account balances
    for (const acc of accounts) {
      if (type.toLowerCase() === "transfer") {
        if ((acc._id as mongoose.Types.ObjectId).equals(fromAccount)) {
          acc.currentBalance -= amount;
        }
        if ((acc._id as mongoose.Types.ObjectId).equals(toAccount)) {
          acc.currentBalance += amount;
        }
      } else {
        if ((acc._id as mongoose.Types.ObjectId).equals(account)) {
          if (type.toLowerCase() === "expense") {
            acc.currentBalance -= amount;
          } else if (type.toLowerCase() === "income") {
            acc.currentBalance += amount;
          }
        }
      }
      await acc.save({ session });
    }

    await record.save({ session });
    await session.commitTransaction();
    session.endSession();

    res.status(201).json(record);
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ message: error.message });
  }
};

export const getRecords = async (req: Request, res: Response) => {
  try {
    const records = await Record.find().sort({ date: -1 });
    res.status(200).json(records);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getRecord = async (req: Request, res: Response) => {
  try {
    const record = await Record.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }
    res.status(200).json(record);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateRecord = async (req: Request, res: Response) => {
  try {
    const record = await Record.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }
    res.status(200).json(record);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteRecord = async (req: Request, res: Response) => {
  try {
    const record = await Record.findByIdAndDelete(req.params.id);
    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }
    res.status(200).json({ message: "Record deleted successfully" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
// recent transaction 4 latest
export const recentRecord = async (req: Request, res: Response) => {
  try {
    const records = await Record.find().sort({ date: -1 }).limit(4);
    console.log(records);
    res.status(200).json(records);
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};
// Cash Flow Trend line chart for expense and income
export const cashFlowTrend = async (req: Request, res: Response) => {
  try {
    const cashFlow = await Record.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          expense: {
            $sum: {
              $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0],
            },
          },
          income: {
            $sum: {
              $cond: [{ $eq: ["$type", "income"] }, "$amount", 0],
            },
          },
        },
      },
      { $sort: { _id: 1 } }, // Sorting by date in ascending order
    ]);
    res.status(200).json(cashFlow);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// total balance, monthly income ,monthly expenditure
export const getSummary = async (req: Request, res: Response) => {
  try {
    const summary = await Record.aggregate([
      {
        $group: {
          _id: null,
          totalBalance: { $sum: "$amount" },
          totalIncome: {
            $sum: {
              $cond: [{ $eq: ["$type", "income"] }, "$amount", 0],
            },
          },
          totalExpense: {
            $sum: {
              $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0],
            },
          },
        },
      },
    ]);
    res.status(200).json(summary[0]);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
