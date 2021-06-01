import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";


let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw'
}

describe('Get Statement Operation', () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository,
    );
  })

  it('shoul be able to get statement operation', async () => {
    const user = await inMemoryUsersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456'
    });

    const statementOperation = await inMemoryStatementsRepository.create({
      user_id: user.id as string,
      description: 'Depósito em conta',
      amount: 300,
      type: OperationType.DEPOSIT,
    });

    const operation = await getStatementOperationUseCase.execute({
      user_id: user.id as string,
      statement_id: statementOperation.id as string
    })

    expect(operation.id).toEqual(statementOperation.id);
  })

  it('shoul not be able to get statement operation if user not exists', async () => {
    expect(async () => {
      const user = await inMemoryUsersRepository.create({
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: '123456'
      });

      const statementOperation = await inMemoryStatementsRepository.create({
        user_id: user.id as string,
        description: 'Depósito em conta',
        amount: 300,
        type: OperationType.DEPOSIT,
      });

      await getStatementOperationUseCase.execute({
        user_id: '121212',
        statement_id: statementOperation.id as string
      })
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  })

  it('shoul not be able to get statement operation if operation not exists', async () => {
    expect(async () => {
      const user = await inMemoryUsersRepository.create({
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: '123456'
      });

      await getStatementOperationUseCase.execute({
        user_id: user.id as string,
        statement_id: '12345678'
      })
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  })
})
