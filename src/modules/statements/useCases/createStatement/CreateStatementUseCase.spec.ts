import { InMemoryStatementsRepository } from "./../../repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "./../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./../../../users/useCases/createUser/CreateUserUseCase";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { OperationType } from "../../entities/Statement";
import { CreateStatementError } from "./CreateStatementError";

describe("Create Statement Test", () => {
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let inMemoryStatementsRepository: InMemoryStatementsRepository;
  let createStatementUseCase: CreateStatementUseCase;
  let createUserUseCase: CreateUserUseCase;

  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to make a deposit and a withdraw", async () => {
    const user = await createUserUseCase.execute({
      name: "Antonio",
      email: "antonio@gmail.com",
      password: "123456789",
    });

    const deposito = await createStatementUseCase.execute({
      amount: 1000,
      description: "deposito",
      type: OperationType.DEPOSIT,
      user_id: user.id as string,
    });

    const saque = await createStatementUseCase.execute({
      amount: 200,
      description: "saque",
      type: OperationType.WITHDRAW,
      user_id: user.id as string,
    });

    expect(deposito).toHaveProperty("id");
    expect(deposito).toHaveProperty("type", "deposit");
    expect(saque).toHaveProperty("id");
    expect(saque).toHaveProperty("type", "withdraw");
  });

  it("should not be able to make a statament with a not existant user", async () => {
    expect(async () => {
      await createStatementUseCase.execute({
        amount: 1000,
        description: "deposito",
        type: OperationType.DEPOSIT,
        user_id: "adsadad",
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
    expect(async () => {
      await createStatementUseCase.execute({
        amount: 1000,
        description: "saque",
        type: OperationType.WITHDRAW,
        user_id: "adsadad",
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("should not be able to make a WITHDRAW with insufficient funds", async () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: "Antonio",
        email: "antonio@gmail.com",
        password: "123456789",
      });

      await createStatementUseCase.execute({
        amount: 200,
        description: "saque",
        type: OperationType.WITHDRAW,
        user_id: user.id as string,
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
});
