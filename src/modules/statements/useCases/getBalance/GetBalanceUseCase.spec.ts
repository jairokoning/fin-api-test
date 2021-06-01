import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";


let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getBalanceUseCase: GetBalanceUseCase

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw'
}

describe('Get Balance', () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository
    );
  })

  it('shoul be able to get balance', async () => {
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

    await inMemoryStatementsRepository.create({
      user_id: user.id as string,
      description: 'Depósito em conta',
      amount: 250,
      type: OperationType.WITHDRAW,
    });

    const statement = await getBalanceUseCase.execute({
      user_id: user.id as string,
    })

    expect(statement.balance).toEqual(50);
  })

  it('shoul not be able to get balance if user not exists', async () => {
    expect(async () => {
      await getBalanceUseCase.execute({
        user_id: '1234'
      })
    }).rejects.toBeInstanceOf(GetBalanceError);
  })
})
