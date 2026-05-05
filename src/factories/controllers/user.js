import {
    IdGeneratorAdapter,
    PasswordHasherAdapter,
} from '../../adapters/index.js';
import {
    CreateUserController,
    DeleteUserController,
    GetUserBalanceController,
    GetUserByIdController,
    UpdateUserController,
} from '../../controllers/index.js';
import {
    PostgresCreateUserRepository,
    PostgresDeleteUserRepository,
    PostgresGetUserBalanceRepository,
    PostgresgetUserByEmailRepository,
    PostgresGetUserByIdRepository,
    PostgresUpdateUserRepository,
} from '../../repositories/postgres/index.js';
import {
    CreateUserUseCase,
    DeleteUserUseCase,
    GetUserBalanceUseCase,
    GetUserByIdUseCase,
    UpdateUserUseCase,
} from '../../use-cases/index.js';

export const makeGetUserByIdController = () => {
    const getUserByIdRepository = new PostgresGetUserByIdRepository();

    const getUserByIdUseCase = new GetUserByIdUseCase(getUserByIdRepository);

    const getUserByIdController = new GetUserByIdController(getUserByIdUseCase);

    return getUserByIdController;
};

export const makeCreateUserController = () => {
    const getUserByEmailRepository = new PostgresgetUserByEmailRepository();

    const createUserRepository = new PostgresCreateUserRepository();

    const passwordHasherAdapter = new PasswordHasherAdapter();

    const idGeneratorAdapter = new IdGeneratorAdapter();

    const createUserUseCase = new CreateUserUseCase(
        getUserByEmailRepository,
        createUserRepository,
        passwordHasherAdapter,
        idGeneratorAdapter,
    );

    const createUserController = new CreateUserController(createUserUseCase);

    return createUserController;
};

export const makeUpdateUserController = () => {
    const getUserByEmailRepository = new PostgresgetUserByEmailRepository();

    const getUserByIdRepository = new PostgresGetUserByIdRepository();

    const updateUserRepository = new PostgresUpdateUserRepository();

    const updateUserUseCase = new UpdateUserUseCase(
        getUserByEmailRepository,
        updateUserRepository,
        getUserByIdRepository,
    );

    const updateUserController = new UpdateUserController(updateUserUseCase);

    return updateUserController;
};

export const makeDeleteUserController = () => {
    const deleteUserRepository = new PostgresDeleteUserRepository();

    const deleteUserUseCase = new DeleteUserUseCase(deleteUserRepository);

    const deleteUserController = new DeleteUserController(deleteUserUseCase);

    return deleteUserController;
};

export const makeGetUserBalanceController = () => {
    const getUserBalanceRepository = new PostgresGetUserBalanceRepository();

    const getUserByIdRepository = new PostgresGetUserByIdRepository();

    const getUserBalanceUseCase = new GetUserBalanceUseCase(
        getUserBalanceRepository,
        getUserByIdRepository,
    );

    const getUserBalanceController = new GetUserBalanceController(
        getUserBalanceUseCase,
    );

    return getUserBalanceController;
};
