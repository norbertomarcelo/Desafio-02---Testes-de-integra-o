import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";

describe("Authenticate User Controller", () => {
  let connection: Connection;

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to authenticate an user", async () => {
    await request(app).post("/api/v1/users").send({
      name: "User Name",
      email: "user@email.com",
      password: "password123",
    });

    const login = await request(app)
      .post("/api/v1/sessions")
      .send({ email: "user@email.com", password: "password123" });

    expect(login.body).toHaveProperty("token");
    expect(login.body).toHaveProperty("user");
    expect(login).not.toHaveProperty("password");
  });
});
