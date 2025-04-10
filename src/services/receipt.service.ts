import { v4 as uuidv4 } from "uuid";
import { Receipt } from "../schemas/receipt.schema";

/**
 * An in-memory map of receipt IDs to their scores that serves as a standin for a database
 */
const receiptScoreStore = new Map<string, number>();

/**
 * Saves a receipt's score to the in-memory map. Generates a new ID for the receipt.
 * @param score - The score of the receipt
 * @returns The ID of the receipt
 */
export async function saveReceiptScore(score: number) {
  const id = uuidv4();
  receiptScoreStore.set(id, score);
  return id;
}

/**
 * Retrieves a receipt's score from the in-memory map.
 * @param id - The ID of the receipt
 * @returns The score of the receipt
 */
export function getReceiptPoints(id: string) {
  return receiptScoreStore.get(id);
}

/**
 * Saves a receipt and scores it
 * @param receipt - The receipt to save and score
 * @returns The total score of the receipt
 */
export async function saveAndScoreReceipt(receipt: Receipt) {
  const totalScore = calculatePointsForReceipt(receipt);

  // Save the receipt
  const receiptId = await saveReceiptScore(totalScore);
  return receiptId;
}

/**
 * Scores a receipt
 * @param receipt - The receipt to score
 * @pre receipt is of a valid format
 * @returns The total score of the receipt
 */
export function calculatePointsForReceipt(receipt: Receipt) {
  // 1 point for every alphanumeric character in the retailer name
  const retailerNameScore = [...receipt.retailer].filter((char) => /[a-zA-Z0-9]/.test(char)).length;

  // 50 points if the total is a round dollar amount
  const intTotalAmountScore = Number.isInteger(receipt.total) ? 50 : 0;

  // 25 points if the total is a multiple of 0.25
  const multipleOf25Score = Number.isInteger(receipt.total * 4) ? 25 : 0;

  // 5 points for every 2 items
  const itemCountScore = Math.floor(receipt.items.length / 2) * 5;

  // If the trimmed length of the item description is a multiple of 3, multiply the price by 0.2 and round up to the nearest integer.
  const descriptionLengthScore = receipt.items
    .filter((item) => item.shortDescription.trim().length % 3 === 0)
    .reduce((acc, item) => acc + Math.ceil(item.price * 0.2), 0);

  // 6 points if day of purchase is odd
  let oddDayScore = 0;
  try {
    const purchaseDate = new Date(receipt.purchaseDate);
    const isOddDay = purchaseDate.getDate() % 2 === 1;
    oddDayScore = isOddDay ? 6 : 0;
  } catch (error) {
    console.error("Error parsing purchase date:", error);
  }

  // 10 points if time of purchase is after 2:00pm and before 4:00pm
  let timeOfPurchaseScore = 0;
  try {
    const purchaseTime = new Date(`1970-01-01T${receipt.purchaseTime}`);
    const isBetween2And4 = purchaseTime.getHours() >= 14 && purchaseTime.getHours() <= 16;
    timeOfPurchaseScore = isBetween2And4 ? 10 : 0;
  } catch (error) {
    console.error("Error parsing purchase time:", error);
  }

  const totalScore =
    retailerNameScore +
    intTotalAmountScore +
    multipleOf25Score +
    itemCountScore +
    descriptionLengthScore +
    oddDayScore +
    timeOfPurchaseScore;
  return totalScore;
}
