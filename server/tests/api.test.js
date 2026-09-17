const request = require("supertest");

const app = require("../app");

describe("API Tests", () => {
  test("GET /api/health returns server status", async () => {
    const response = await request(app)
      .get("/api/health");

    expect(response.statusCode).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.message).toBe(
      "Signal API is running"
    );
  });

  test("POST /api/auth/register validates required fields", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({});

    expect(response.statusCode).toBe(400);

    expect(response.body.success).toBe(false);

    expect(response.body.message).toBe(
      "Name, email and password are required"
    );
  });

  test("POST /api/auth/login validates required fields", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({});

    expect(response.statusCode).toBe(400);

    expect(response.body.success).toBe(false);

    expect(response.body.message).toBe(
      "Email and password are required"
    );
  });

  test("GET /api/reports requires authentication", async () => {
    const response = await request(app)
      .get("/api/reports");

    expect(response.statusCode).toBe(401);

    expect(response.body.success).toBe(false);
  });
});