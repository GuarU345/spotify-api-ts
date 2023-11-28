import request, { Response } from "supertest";
import { app } from "../app";
const authToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImUxOWYxYzEwLWM1ZWQtNDkyMS05MmZlLTc5ZTM4NGJlMDI3OCIsImVtYWlsIjoiYWJlbEBnbWFpbC5jb20iLCJpYXQiOjE2OTkyODA4MDV9.v-365CZyEG5_ImP5HlrnVIQnLUdu9AOpLAs2n1FZIBA";

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
