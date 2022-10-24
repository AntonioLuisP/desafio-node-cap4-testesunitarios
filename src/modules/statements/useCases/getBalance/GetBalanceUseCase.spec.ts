import { InMemoryStatementsRepository } from "./../../repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "./../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./../../../users/useCases/createUser/CreateUserUseCase";
import { GetBalanceUseCase } from "./GetBalanceUseCase";
import { GetBalanceError } from "./GetBalanceError";

describe("Balance Test", () => {
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let inMemoryStatementsRepository: InMemoryStatementsRepository;
  let getBalanceUseCase: GetBalanceUseCase;
  let createUserUseCase: CreateUserUseCase;

  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository
    );
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to make a deposit and a withdraw", async () => {
    const user = await createUserUseCase.execute({
      name: "Antonio",
      email: "antonio@gmail.com",
      password: "123456789",
    });

    const balance = await getBalanceUseCase.execute({
      user_id: user.id as string,
    });

    expect(balance).toHaveProperty("statement");
    expect(balance).toHaveProperty("balance");
  });

  it("should not be able to get the balance of a not existant user", async () => {
    expect(async () => {
      await getBalanceUseCase.execute({
        user_id: "dsadaihdasodjn",
      });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});
