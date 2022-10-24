import { InMemoryUsersRepository } from "./../../repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { CreateUserUseCase } from "./../createUser/CreateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User Test", () => {
  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUsersRepository
    );
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("Should be able de authenticate a user", async () => {
    const user = {
      name: "Antonio",
      email: "antonio@gmail.com",
      password: "123456789",
    };
    await createUserUseCase.execute(user);

    const auth = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(auth).toHaveProperty("token");
  });

  it("Should not be able to authenticate a not existant user", async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "teste@gmail.com",
        password: "123456789",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("Should not be able to authenticate a user with the wrong password", async () => {
    expect(async () => {
      const user = {
        name: "Lubbuck",
        email: "Lubbuck@gmail.com",
        password: "123456789",
      };
      await createUserUseCase.execute(user);

      await authenticateUserUseCase.execute({
        email: user.email,
        password: "senha errada",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
