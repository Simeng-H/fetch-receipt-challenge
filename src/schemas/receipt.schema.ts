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
  purchaseDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (expected YYYY-MM-DD)")
    .transform((dateStr) => {
      const [year, month, day] = dateStr.split("-").map(Number);
      return new Date(year, month - 1, day);
    }),
  purchaseTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Invalid time format (expected HH:MM)")
    .transform((timeStr) => {
      const [hours, minutes] = timeStr.split(":").map(Number);
      const date = new Date();
      date.setHours(hours, minutes, 0, 0);
      return date;
    }),
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
