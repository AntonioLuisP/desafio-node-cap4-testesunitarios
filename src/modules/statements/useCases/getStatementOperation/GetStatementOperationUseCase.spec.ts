import { InMemoryStatementsRepository } from "./../../repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "./../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./../../../users/useCases/createUser/CreateUserUseCase";
import { CreateStatementUseCase } from "./../createStatement/CreateStatementUseCase";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";
import { OperationType } from "../../entities/Statement";
import { GetStatementOperationError } from "./GetStatementOperationError";

describe("Statement Operation Test", () => {
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let inMemoryStatementsRepository: InMemoryStatementsRepository;
  let getStatementOperationUseCase: GetStatementOperationUseCase;
  let createUserUseCase: CreateUserUseCase;
  let createStatementUseCase: CreateStatementUseCase;

  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should be to get the statement of a user operation", async () => {
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

    const operation = await getStatementOperationUseCase.execute({
      user_id: user.id as string,
      statement_id: deposito.id as string,
    });

    expect(operation).toHaveProperty("id");
  });

  it("should not be to get the statement operation of a not existant user", async () => {
    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: "dasdad",
        statement_id: "sadsada",
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("should not be to get the statement of a not existant operation", async () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: "Antonio",
        email: "antonio@gmail.com",
        password: "123456789",
      });

      await getStatementOperationUseCase.execute({
        user_id: user.id as string,
        statement_id: "sadsada",
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});
