import request from "supertest";

import app from "../src/app";

describe("app", () => {
  it("responds with a not found message when given a non-existent route", (done) => {
    request(app).get("/non-existent-route").expect(404, done);
  });
});

describe("GET /", () => {
  it("responds with a json message", (done) => {
    request(app).get("/").set("Accept", "application/json").expect("Content-Type", /json/).expect(
      200,
      {
        message: "Receipts Processing Service is running",
      },
      done,
    );
  });
});
