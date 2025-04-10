import { z } from "zod";

export const receiptItemSchema = z.object({
  shortDescription: z.string(),
  price: z.string().transform((price) => {
    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice)) {
      throw new Error("Invalid price format");
    }
    return numericPrice;
  }),
});

export const receiptSchema = z.object({
  retailer: z.string(),
  purchaseDate: z.string(),
  purchaseTime: z.string(),
  items: z.array(receiptItemSchema),
  total: z.string().transform((total) => {
    const numericTotal = parseFloat(total);
    if (isNaN(numericTotal)) {
      throw new Error("Invalid total format");
    }
    return numericTotal;
  }),
});

export type Receipt = z.infer<typeof receiptSchema>;
export type ReceiptItem = z.infer<typeof receiptItemSchema>;
