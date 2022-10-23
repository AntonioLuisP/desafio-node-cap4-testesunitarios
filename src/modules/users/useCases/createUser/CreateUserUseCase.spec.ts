import { CreateUserError } from "./CreateUserError";
import { InMemoryUsersRepository } from "./../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User Test", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("Should be able de create a user", async () => {
    const user = await createUserUseCase.execute({
      name: "Antonio",
      email: "antonio@gmail.com",
      password: "123456789",
    });

    expect(user).toHaveProperty("id");
  });

  it("Should not be able to create a existant user", async () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "Lubbuck",
        email: "lubbuck@gmail.com",
        password: "123456789",
      });
      await createUserUseCase.execute({
        name: "Lubbuck2",
        email: "lubbuck@gmail.com",
        password: "123456789",
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
