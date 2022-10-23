import { InMemoryUsersRepository } from "./../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show User Profile Test", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(
      inMemoryUsersRepository
    );
  });

  it("Show be able to show a user By the id", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "Antonio",
      email: "antonio@gmail.com",
      password: "123456789",
    });

    const userFinded = await showUserProfileUseCase.execute(user.id as string);

    expect(user).toBe(userFinded);
  });

  it("Show not be able to show a not existent user By the id", async () => {
    expect(async () => {
      const userFinded = await showUserProfileUseCase.execute("dsabiudbsaiud");
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
