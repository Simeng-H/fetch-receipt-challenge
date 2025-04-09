import { z } from "zod";

export const receiptItemSchema = z.object({
  shortDescription: z.string(),
  price: z.number(),
});

export const receiptSchema = z.object({
  retailer: z.string(),
  purchaseDate: z.string(),
  purchaseTime: z.string(),
  items: z.array(receiptItemSchema),
  total: z.number(),
});

export type Receipt = z.infer<typeof receiptSchema>;
export type ReceiptItem = z.infer<typeof receiptItemSchema>;
