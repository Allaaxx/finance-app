import { CreateTransactionController } from '../../controllers/index.js';
import {
    PostgresCreateTransactionRepository,
    PostgresGetUserByIdRepository,
} from '../../repositories/postgres/index.js';
import { CreateTransactionUseCase } from '../../use-cases/index.js';

export const makeCreateTransactionController = () => {
    const createTransactionRepository =
        new PostgresCreateTransactionRepository();

    const getUserByIdRepository = new PostgresGetUserByIdRepository();

    const createTransactionUseCase = new CreateTransactionUseCase(
        createTransactionRepository,
        getUserByIdRepository,
    );

    const creaTransactionController = new CreateTransactionController(
        createTransactionUseCase,
    );

    return creaTransactionController;
};
