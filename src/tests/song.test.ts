import request, { Response } from "supertest";
import { app } from "../app";
const authToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjdlMTc4ZGM1LTkyZTgtNDE0MS1hMDg3LWNmM2YzMjY1NzhjNSIsImVtYWlsIjoiZ3VhcnVAZ21haWwuY29tIiwiaWF0IjoxNjk3OTE1OTM0fQ.I_Z73N272k1MV08EtflDbcfxY6x3H7Ji-AEfYtNuvNg";

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
