import request from "supertest";
import { Connection } from 'typeorm';
import { v4 as uuid } from "uuid";
import { hash } from "bcryptjs";

import { app } from "../../../../app";
import createConnection from '../../../../database/index';

let connection: Connection;
describe('Create Statement', () => {
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

  it('should be able to create new deposit statement', async () => {
    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: 'john.doe@example.com',
      password: '123456',
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post('/api/v1/statements/deposit')
      .send({
        amount: 500,
        description: 'Deposit'
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(201);
  });

  it('should be able to create new withdraw statement', async () => {
    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: 'john.doe@example.com',
      password: '123456',
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post('/api/v1/statements/withdraw')
      .send({
        amount: 130,
        description: 'Withdraw'
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(201);
  });

  it('should not be able to create new withdraw statement if insufficient funds', async () => {
    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: 'john.doe@example.com',
      password: '123456',
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post('/api/v1/statements/withdraw')
      .send({
        amount: 700,
        description: 'Withdraw'
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(400);
  });

  it('should not be able to create new statement if user not exists', async () => {

    const response = await request(app)
      .post('/api/v1/statements/deposit')
      .send({
        amount: 50,
        description: 'Deposit'
      })
      .set({
        Authorization: `Bearer 123456789965482130`,
      });

    expect(response.status).toBe(401);
  });


});
