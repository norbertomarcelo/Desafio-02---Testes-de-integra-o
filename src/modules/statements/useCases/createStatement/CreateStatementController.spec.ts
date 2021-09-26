import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";

describe("Create Statement Controller", () => {
  let connection: Connection;

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create deposit statement", async () => {
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
      .post("/api/v1/statements/deposit")
      .send({
        amount: 100,
        description: "Deposit test",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.amount).toBe(100);
  });

  it("should be able to create withdraw statement", async () => {
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
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 50,
        description: "Withdraw test",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.amount).toBe(50);
  });
});
