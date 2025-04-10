import request from "supertest";
import app from "../src/app";

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
