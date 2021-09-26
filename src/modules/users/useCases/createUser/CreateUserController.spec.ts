import request from "supertest";
import { Connection, createConnection } from "typeorm";

import { app } from "../../../../app";

describe("Create User Controller", () => {
  let connection: Connection;

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create a new user", async () => {
    const response = await request(app).post("/api/v1/users").send({
      name: "User Name",
      email: "user@email.com",
      password: "password123",
    });

    expect(response.status).toBe(201);
  });
});
