import { Request, Response } from "express";
import { receiptSchema } from "../schemas/receipt.schema";
import { getReceiptPoints, saveAndScoreReceipt } from "../services/receipt.service";

export async function processReceipt(req: Request, res: Response) {
  const { success, data, error } = receiptSchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json({ error: error.message });
  }
  const receipt = data;
  const receiptId = await saveAndScoreReceipt(receipt);
  res.status(200).json({ id: receiptId });
}

export async function getReceiptScore(req: Request, res: Response) {
  const { id } = req.params;
  const points = getReceiptPoints(id);
  if (!points) {
    return res.status(404).json({ error: "Receipt not found" });
  }
  res.status(200).json({ points });
}
