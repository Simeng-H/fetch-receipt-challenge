import { Router } from "express";
import { getReceiptScore, processReceipt } from "../controllers/receipt.controller";

const router = Router();

router.post("/process", processReceipt);
router.get("/:id/points", getReceiptScore);

export default router;
