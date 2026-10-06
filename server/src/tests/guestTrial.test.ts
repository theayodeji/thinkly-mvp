import request from "supertest";
import app from "../app.js";
import GuestSession from "../models/GuestSession.js";
import Space from "../models/Space.js";

describe("Public Guest Trial Routes & Limits", () => {
  const guestDeviceId = "test-guest-device-123";

  beforeEach(async () => {
    await GuestSession.deleteMany({});
    await Space.deleteMany({});
  });

  it("should allow guest to create 1 space and block the 2nd space with GUEST_LIMIT_REACHED", async () => {
    // 1st Space Creation -> Succeeds
    const res1 = await request(app)
      .post("/api/spaces/create")
      .set("X-Guest-Device-Id", guestDeviceId);

    expect(res1.status).toBe(200);
    expect(res1.body.space).toBeDefined();

    // 2nd Space Creation -> Blocked
    const res2 = await request(app)
      .post("/api/spaces/create")
      .set("X-Guest-Device-Id", guestDeviceId);

    expect(res2.status).toBe(403);
    expect(res2.body.code).toBe("GUEST_LIMIT_REACHED");
  });

  it("should enforce guest chat limit of 10 messages", async () => {
    const spaceRes = await request(app)
      .post("/api/spaces/create")
      .set("X-Guest-Device-Id", guestDeviceId);
    const spaceId = spaceRes.body.space._id;

    // Create 10 messages directly on GuestSession
    await GuestSession.updateOne(
      { deviceId: guestDeviceId },
      { messagesCount: 10 }
    );

    // 11th chat message request -> Blocked with 403
    const res = await request(app)
      .post("/api/spaces/chat")
      .set("X-Guest-Device-Id", guestDeviceId)
      .send({ spaceId, message: "Hello AI" });

    expect(res.status).toBe(403);
    expect(res.body.code).toBe("GUEST_LIMIT_REACHED");
  });

  it("should restrict guests from non-public features (e.g. voice audio explainers)", async () => {
    const spaceRes = await request(app)
      .post("/api/spaces/create")
      .set("X-Guest-Device-Id", guestDeviceId);
    const spaceId = spaceRes.body.space._id;

    const res = await request(app)
      .post(`/api/explainers/space/${spaceId}`)
      .set("X-Guest-Device-Id", guestDeviceId)
      .send({ title: "Guest Voice Explainer", targetAudience: "beginners" });

    expect([401, 403]).toContain(res.status);
  });
});
