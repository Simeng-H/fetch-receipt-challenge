import { Request, Response } from "express";
import { saveAndScoreReceipt } from "../services/receipt.service";

export async function processReceipt(req: Request, res: Response) {
  const { receipt } = req.body;
  const receiptId = await saveAndScoreReceipt(receipt);
  res.status(200).json({ receiptId });
}
