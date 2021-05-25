import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe('List User', () => {
  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
  })

  it('should be able to show user profile', async () => {
    const user_email = 'john.doe@example.com';

     const user = await inMemoryUsersRepository.create({
      name: 'John Doe',
      email: user_email,
      password: '123456'
    })

    const id = user.id || '112233';
    const profile = await showUserProfileUseCase.execute(id)

    expect(profile).toEqual(user);
  })

  it('should not be able to show profile if user not exists', async () => {
    expect(async () => {
      await showUserProfileUseCase.execute('112233');
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  })
})
