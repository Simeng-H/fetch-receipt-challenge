import request from "supertest";
import app from "../src/app";
import { receiptSchema } from "../src/schemas/receipt.schema";
import { calculatePointsForReceipt } from "../src/services/receipt.service";

// Integration tests
const VALID_RECEIPT = {
  retailer: "Target",
  purchaseDate: "2022-01-01",
  purchaseTime: "13:01",
  items: [
    {
      shortDescription: "Mountain Dew 12PK",
      price: "6.49",
    },
    {
      shortDescription: "Emils Cheese Pizza",
      price: "12.25",
    },
    {
      shortDescription: "Knorr Creamy Chicken",
      price: "1.26",
    },
    {
      shortDescription: "Doritos Nacho Cheese",
      price: "3.35",
    },
    {
      shortDescription: "   Klarbrunn 12-PK 12 FL OZ  ",
      price: "12.00",
    },
  ],
  total: "35.35",
};

describe("Sending a valid receipt to the API results in the receipt being processed and score persisted", () => {
  let receiptId: string;
  let postResponse: request.Response;

  beforeAll(async () => {
    postResponse = await request(app).post("/receipts/process").send(VALID_RECEIPT);
    receiptId = postResponse.body.id;
  });

  it("returns a 200 status code and a receipt id when given a valid receipt", async () => {
    expect(postResponse.status).toBe(200);
    expect(postResponse.body.id).toBeDefined();
    expect(typeof postResponse.body.id).toBe("string");
  });
  it("allows the user to retrieve the score for a receipt", async () => {
    const response = await request(app).get(`/receipts/${receiptId}/points`).expect(200);
    expect(response.body.points).toBeDefined();
    expect(typeof response.body.points).toBe("number");
  });
  it("returns a 404 status code when the receipt id is not found", async () => {
    await request(app).get(`/receipts/1234567890/points`).expect(404);
  });
  it("returns a 400 status code when the receipt is not valid", async () => {
    await request(app).post("/receipts/process").send({}).expect(400);
  });
});

// Unit tests
const ORIGINAL_RECEIPT = {
  retailer: "M&M Corner Market",
  purchaseDate: "2022-03-20",
  purchaseTime: "14:33",
  items: [
    {
      shortDescription: "Gatorade",
      price: "2.25",
    },
    {
      shortDescription: "Gatorade",
      price: "2.25",
    },
    {
      shortDescription: "Gatorade",
      price: "2.25",
    },
    {
      shortDescription: "Gatorade",
      price: "2.25",
    },
  ],
  total: "9.00",
};
const PURCHASE_DATE_TIME = new Date(2022, 2, 20, 14, 33);
const PARSED_RECEIPT = {
  retailer: "M&M Corner Market",
  purchaseDate: PURCHASE_DATE_TIME,
  purchaseTime: PURCHASE_DATE_TIME,
  items: [
    {
      shortDescription: "Gatorade",
      price: 2.25,
    },
    {
      shortDescription: "Gatorade",
      price: 2.25,
    },
    {
      shortDescription: "Gatorade",
      price: 2.25,
    },
    {
      shortDescription: "Gatorade",
      price: 2.25,
    },
  ],
  total: 9.0,
};
describe("Service layer correctly calculates points for a receipt", () => {
  it("gives the example receipt 109 points", () => {
    const points = calculatePointsForReceipt(PARSED_RECEIPT);
    expect(points).toBe(109);
  });
});
describe("Parser correctly parses a receipt", () => {
  it("parses the example receipt correctly", () => {
    const parsedReceipt = receiptSchema.parse(ORIGINAL_RECEIPT);
    expect(parsedReceipt.retailer).toBe(ORIGINAL_RECEIPT.retailer);
    expect(parsedReceipt.purchaseDate.getDate()).toEqual(PARSED_RECEIPT.purchaseDate.getDate());
    expect(parsedReceipt.purchaseTime.getHours()).toEqual(PARSED_RECEIPT.purchaseTime.getHours());
    expect(parsedReceipt.items).toEqual(PARSED_RECEIPT.items);
    expect(parsedReceipt.total).toEqual(PARSED_RECEIPT.total);
  });
  it("returns an error when the receipt is not valid", () => {
    expect(() => receiptSchema.parse({})).toThrow();
  });
});
