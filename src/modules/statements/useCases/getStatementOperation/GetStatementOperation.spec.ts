import request from "supertest";
import { Connection } from 'typeorm';
import { v4 as uuid } from "uuid";
import { hash } from "bcryptjs";

import { app } from "../../../../app";
import createConnection from '../../../../database/index';

let connection: Connection;
describe('Get Statement Operation', () => {
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

  it('should be able to get statement operation', async () => {
    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: 'john.doe@example.com',
      password: '123456',
    });

    const { token } = responseToken.body;

    const statement = await request(app)
      .post('/api/v1/statements/deposit')
      .send({
        amount: 500,
        description: 'Deposit'
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const response = await request(app)
      .get(`/api/v1/statements/${statement.body.id}`)
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.body.id).toBe(statement.body.id);
  });

  it('should not be able to get statement if user not exists', async () => {
    const response = await request(app)
      .get('/api/v1/statements/12345')
      .set({
        Authorization: `Bearer 1236547981264`,
      });

    expect(response.status).toBe(401);
  });
});
