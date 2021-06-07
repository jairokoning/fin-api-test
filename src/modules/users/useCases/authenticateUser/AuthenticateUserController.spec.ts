import request from "supertest";
import { Connection } from 'typeorm';
import { v4 as uuid } from "uuid";
import { hash } from "bcryptjs";

import { app } from "../../../../app";
import createConnection from '../../../../database/index';

let connection: Connection;
describe('Create Session', () => {
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

  it('should be able to authenticate user', async () => {
    const response = await request(app).post('/api/v1/sessions').send({
      email: 'john.doe@example.com',
      password: '123456'
    })

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it("should not be able to authenticate user if email doesn't match", async () => {
    const response = await request(app).post('/api/v1/sessions').send({
      email: 'wrong.email@example.com',
      password: '123456'
    })

    expect(response.status).toBe(401);
  });

  it("should not be able to authenticate user if password doesn't match", async () => {
    const response = await request(app).post('/api/v1/sessions').send({
      email: 'john.doe@example.com',
      password: 'wrong_password'
    })

    expect(response.status).toBe(401);
  });

});
