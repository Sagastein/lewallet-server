import { Request, Response } from "express";
import Currency from "../models/currency.model";

export const getCurrencies = async (req: Request, res: Response) => {
  try {
    const currencies = await Currency.find();
    return res.status(200).json(currencies);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getCurrency = async (req: Request, res: Response) => {
  try {
    const currency = await Currency.findById(req.params.id);
    if (!currency)
      return res.status(404).json({ message: "Currency not found" });
    res.json(currency);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createCurrency = async (req: Request, res: Response) => {
  const currency = new Currency(req.body);
  try {
    const newCurrency = await currency.save();
    res.status(201).json(newCurrency);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateCurrency = async (req: Request, res: Response) => {
  try {
    const currency = await Currency.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!currency)
      return res.status(404).json({ message: "Currency not found" });
    res.json(currency);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteCurrency = async (req: Request, res: Response) => {
  try {
    const currency = await Currency.findByIdAndDelete(req.params.id);
    if (!currency)
      return res.status(404).json({ message: "Currency not found" });
    res.json({ message: "Currency deleted" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
