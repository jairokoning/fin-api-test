import request from "supertest";
import { Connection } from 'typeorm';
import { v4 as uuid } from "uuid";
import { hash } from "bcryptjs";

import { app } from "../../../../app";
import createConnection from '../../../../database/index';

let connection: Connection;
describe('Show User Profile', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuid();
    const password = await hash('123456', 8);

    await connection.query(
      `INSERT INTO USERS(id, name, email, password)
       VALUES('${id}', 'John Doe', 'john.doe@example.com', '${password}')`
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to user profile', async () => {
    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: 'john.doe@example.com',
      password: '123456',
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .get('/api/v1/profile')
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(200);
  });

  it("should not be able to show user if not exists", async () => {
    const response = await request(app)
      .get('/api/v1/profile')
      .set({
        Authorization: `Bearer 123456789987456321`,
      });

    expect(response.status).toBe(401);
  });
});
