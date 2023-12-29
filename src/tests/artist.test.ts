import request, { Response } from "supertest";
import { app } from "../app";
import { Artist } from "@prisma/client";

describe("try to get all artists", () => {
  it("should response with status 200", async () => {
    const response = await request(app)
      .get("/api/artists")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`);
    expect(response.status).toBe(200);
  });

  it("should have a response in JSON format", async () => {
    const response = await request(app)
      .get("/api/artists")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`);
    expect(response.header["content-type"]).toContain("application/json");
  });

  it("should have response is not empty", async () => {
    const response = await request(app)
      .get("/api/artists")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("should respond with correct format of json", async () => {
    const response = await request(app)
      .get("/api/artists")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`);
    const artists = response.body;
    expect(
      artists.every((artist: Artist) => artist.name && artist.nationality)
    ).toBe(true);
  });
});

describe("try to create a artist", () => {
  it("data of request body is a valid data", async () => {
    const newArtist = {
      name: "Sia",
      nationality: "American",
    };

    const response = await request(app)
      .post("/api/artists")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .send(newArtist);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(newArtist.name);
    expect(response.body.nationality).toBe(newArtist.nationality);
  });
});
