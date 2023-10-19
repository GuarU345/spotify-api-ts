import request from "supertest";
import { app } from "../app";
const authToken = "";

describe("Try to get songs", () => {
  it("the test response with a status code 200", async () => {
    const response = await request(app)
      .get("/api/songs")
      .set("Authorization", `Bearer ${authToken}`);
    expect(response.status).toBe(200);
  });
});

describe("get songs", () => {
  it("test have the response with json format", async () => {
    const response = await request(app)
      .get("/api/songs")
      .set("Authorization", `Bearer ${authToken}`);
    expect(response.header["content-type"]).toContain("application/json");
  });
});
