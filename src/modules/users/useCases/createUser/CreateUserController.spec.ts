import request from "supertest";
import { Connection } from 'typeorm';

import { app } from "../../../../app";
import createConnection from '../../../../database/index';

let connection: Connection;
describe('Create User', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to create new user', async () => {
    const response = await request(app).post('/api/v1/users').send({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456'
    })

    expect(response.status).toBe(201);
  });

  it('should not be able to create new user if already exists', async () => {
    const response = await request(app).post('/api/v1/users').send({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456'
    });

    expect(response.status).toBe(400);
  });
});
