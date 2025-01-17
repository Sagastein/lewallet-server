import { Request, Response } from "express";
import Record from "../models/record.model";

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
  const record = new Record(req.body);
  try {
    const newRecord = await record.save();
    res.status(201).json(newRecord);
  } catch (error: any) {
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
