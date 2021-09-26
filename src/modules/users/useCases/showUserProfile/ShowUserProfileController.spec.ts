import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";

describe("Show User Profile Controller", () => {
  let connection: Connection;

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to show an user profile", async () => {
    await request(app).post("/api/v1/users").send({
      name: "User Name",
      email: "user@email.com",
      password: "password123",
    });

    const login = await request(app)
      .post("/api/v1/sessions")
      .send({ email: "user@email.com", password: "password123" });

    const token = login.body.token;

    const response = await request(app)
      .get("/api/v1/profile/")
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(200);
    expect(response.body.name).toEqual("User Name");
    expect(response.body.email).toEqual("user@email.com");
  });
});
