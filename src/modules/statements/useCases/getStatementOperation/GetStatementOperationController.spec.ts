import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";

describe("Get Statement Options Controller", () => {
  let connection: Connection;

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to get statemnt options", async () => {
    await request(app).post("/api/v1/users").send({
      name: "User Name",
      email: "user@email.com",
      password: "password123",
    });

    const login = await request(app)
      .post("/api/v1/sessions")
      .send({ email: "user@email.com", password: "password123" });

    const token = login.body.token;

    const statement = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 100,
        description: "Deposit test",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const response = await request(app)
      .get(`/api/v1/statements/${statement.body.id}`)
      .send()
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(statement.body.id);
  });
});
