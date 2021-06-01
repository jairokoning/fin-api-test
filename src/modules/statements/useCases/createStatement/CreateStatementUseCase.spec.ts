import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
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
})
