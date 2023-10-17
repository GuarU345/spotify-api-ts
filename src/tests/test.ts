import request from "supertest";
import { app } from "../app";
const authToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRjZjVlYTlmLTAxMTEtNDdmZi05NzRjLTBkNGU2ZDcxNmUwOCIsImVtYWlsIjoiYWJlbEBnbWFpbC5jb20iLCJpYXQiOjE2OTc1NjM1ODR9.EW9qyhRmSv-7bLq0nuw5PGl6XUoB4L5PN6xiLSrK108";

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
