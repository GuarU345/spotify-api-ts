import request from "supertest";
import { app } from "../app";
import { PlaylistService } from "../services/PlaylistService";

describe("Try to signup", () => {
  it("should to signup a new user and created a initial playlist to the signup user", async () => {
    const newUser = {
      username: "anonimo",
      email: "anonimo@gmail.com",
      password: "Test123!",
    };
    const response = await request(app).post("/api/signup").send(newUser);
    const getLikedSongsPl = await PlaylistService.getLikedSongsPlaylist(
      response.body.id
    );
    expect(getLikedSongsPl).toBeDefined();
    expect(response.body.id).toEqual(getLikedSongsPl?.user_id);
  });
});

describe("Try to signin", () => {
  it("should to return a token", async () => {
    const userCredentials = {
      email: "anonimo@gmail.com",
      password: "Test123!",
    };
    const response = await request(app)
      .post("/api/signin")
      .send(userCredentials);
    expect(response.body.token).toBeDefined();
  });
});
