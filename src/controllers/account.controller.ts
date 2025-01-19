import { Request, Response } from "express";
import Account from "../models/account.model";
import Record from "../models/record.model";
export const getAccounts = async (req: Request, res: Response) => {
  try {
    const accounts = await Account.find();
    res.json(accounts);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAccount = async (req: Request, res: Response) => {
  try {
    const account = await Account.findById(req.params.id);
    if (!account) return res.status(404).json({ message: "Account not found" });
    return res.status(200).json(account);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const createAccount = async (req: Request, res: Response) => {
  const { name, type, initialAmount, currency, excludeFromStatistics } =
    req.body;

  try {
    const account = new Account({
      name,
      type,
      initialAmount,
      currency,
      excludeFromStatistics,
      currentBalance: initialAmount, // Set currentBalance to initialAmount
    });
    await account.save();
    return res.status(201).json(account);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const updateAccount = async (req: Request, res: Response) => {
  try {
    const account = await Account.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!account) return res.status(404).json({ message: "Account not found" });
    res.json(account);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteAccount = async (req: Request, res: Response) => {
  try {
    const account = await Account.findByIdAndDelete(req.params.id);
    if (!account) return res.status(404).json({ message: "Account not found" });
    res.json({ message: "Account deleted" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAccountDetails = async (req: Request, res: Response) => {
  const { accountId } = req.params;
  try {
    const account = await Account.findById(accountId);
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }
    res.json(account);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAccountDetailsWithRecords = async (
  req: Request,
  res: Response
) => {
  const { accountId } = req.params;
  try {
    const account = await Account.findById(accountId);
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    const records = await Record.find({ account: accountId }).sort({
      date: -1,
    });

    res.json({ account, records });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
