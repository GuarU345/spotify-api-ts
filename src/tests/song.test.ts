import request, { Response } from "supertest";
import { app } from "../app";

const validSongId = "0a17e57a-3d32-42de-b18a-9d837971079c";
const invalidSongId = 9999;

describe("Try to get songs", () => {
  let response: Response;
  beforeEach(async () => {
    response = await request(app)
      .get("/api/songs")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`);
  });

  it("should respond with a status code 200", () => {
    expect(response.status).toBe(200);
  });

  it("should have a response in JSON format", () => {
    expect(response.header["content-type"]).toContain("application/json");
  });

  it("should have response is not empty", () => {
    expect(response.body.length).toBeGreaterThan(0);
  });
});

describe("Try to get song by id", () => {
  it("should respond with a status code 200", async () => {
    const response = await request(app)
      .get(`/api/songs/${validSongId}`)
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`);
    expect(response.status).toBe(200);
  });

  it("should have a response in JSON format", async () => {
    const response = await request(app)
      .get(`/api/songs/${validSongId}`)
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`);
    expect(response.header["content-type"]).toContain("application/json");
  });

  it("should respond with status code 404 for non existing song", async () => {
    const response = await request(app)
      .get(`/api/songs/${invalidSongId}`)
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`);
    expect(response.status).toBe(404);
  });

  it("should respond with correct format of json", async () => {
    const expectedResponse = {
      id: "0a17e57a-3d32-42de-b18a-9d837971079c",
      name: "Stay",
      duration: "3:06",
      artist_id: "7ec06602-148d-48e2-8608-30e7315bb3f9",
      album_id: "a5d65b97-f675-4fea-8ade-9d0f7b5f6ef3",
      track: null,
    };
    const response = await request(app)
      .get(`/api/songs/${validSongId}`)
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`);
    expect(response.body).toEqual(expectedResponse);
  });
});
