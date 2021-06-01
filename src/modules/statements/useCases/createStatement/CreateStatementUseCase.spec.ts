import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw'
}

describe('Create Statement', () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  })

  it('shoul be able to create new deposit statement', async () => {
    const user = await inMemoryUsersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456'
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id as string,
      description: 'Bonificação',
      amount: 300,
      type: OperationType.DEPOSIT,
    })

    expect(statement).toHaveProperty('id');
  })

  it('shoul be able to create new withdraw statement', async () => {
    const user = await inMemoryUsersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456'
    });

    await inMemoryStatementsRepository.create({
      user_id: user.id as string,
      description: 'Depósito em conta',
      amount: 300,
      type: OperationType.DEPOSIT,
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id as string,
      description: 'Supermercado',
      amount: 120,
      type: OperationType.WITHDRAW,
    })

    expect(statement).toHaveProperty('id');
  })

  it('shoul not be able to create new statement if user not exists', async () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: '1234',
        description: 'Bonificação',
        amount: 300,
        type: OperationType.DEPOSIT,
      })
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  })

  it('shoul not be able to create withdraw statement if insuficient funds', async () => {
    expect(async () => {
      const user = await inMemoryUsersRepository.create({
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: '123456'
      });

      await inMemoryStatementsRepository.create({
        user_id: user.id as string,
        description: 'Depósito em conta',
        amount: 250,
        type: OperationType.DEPOSIT,
      });

      await createStatementUseCase.execute({
        user_id: user.id as string,
        description: 'Saque',
        amount: 384,
        type: OperationType.WITHDRAW,
      })
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  })
})
