import { Request, Response } from "express";
import Record from "../models/record.model";
import Account from "../models/account.model";
import mongoose from "mongoose";

export const getRecords = async (req: Request, res: Response) => {
  try {
    const records = await Record.find().populate("account");
    res.json(records);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getRecord = async (req: Request, res: Response) => {
  try {
    const record = await Record.findById(req.params.id).populate("account");
    if (!record) return res.status(404).json({ message: "Record not found" });
    res.json(record);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

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

    // Fetch the account(s) involved in the transaction
    const accounts = await Account.find({
      _id: { $in: [account, fromAccount, toAccount].filter((id: any) => id) },
    }).session(session);

    // Check if the account has sufficient funds for the transaction
    if (type === "expense" || type === "Transfer") {
      const expenseAccount = accounts.find(
        (acc) => acc._id.equals(account) || acc._id.equals(fromAccount)
      );
      if (!expenseAccount || expenseAccount.currentBalance < amount) {
        throw new Error("Insufficient funds");
      }
    }

    // Update the account balances
    for (const acc of accounts) {
      if (acc._id.equals(account)) {
        if (type === "expense") {
          acc.currentBalance -= amount;
        } else if (type === "income") {
          acc.currentBalance += amount;
        }
      }
      if (acc._id.equals(fromAccount)) {
        acc.currentBalance -= amount;
      }
      if (acc._id.equals(toAccount)) {
        acc.currentBalance += amount;
      }
      await acc.save();
    }

    // Save the record
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

export const updateRecord = async (req: Request, res: Response) => {
  try {
    const record = await Record.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!record) return res.status(404).json({ message: "Record not found" });
    res.json(record);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteRecord = async (req: Request, res: Response) => {
  try {
    const record = await Record.findByIdAndDelete(req.params.id);
    if (!record) return res.status(404).json({ message: "Record not found" });
    res.json({ message: "Record deleted" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
