import request, { Response } from "supertest";
import { app } from "../app";
const authToken = "";

describe("Try to get songs", () => {
  let response: Response;

  beforeEach(async () => {
    response = await request(app)
      .get("/api/songs")
      .set("Authorization", `Bearer ${authToken}`);
  });

  it("should respond with a status code 200", () => {
    expect(response.status).toBe(200);
  });

  it("should have a response in JSON format", () => {
    expect(response.header["content-type"]).toContain("application/json");
  });
});
