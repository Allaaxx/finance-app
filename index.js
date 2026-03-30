import 'dotenv/config.js';
import express from 'express';
import {
    CreateUserController,
    DeleteUserController,
    GetUserByIdController,
    UpdateUserController,
} from './src/controllers/index.js';
import { PostgresCreateUserRepository } from './src/repositories/postgres/create-user.js';
import { PostgresDeleteUserRepository } from './src/repositories/postgres/delete-user.js';
import { PostgresGetUserByIdRepository } from './src/repositories/postgres/get-user-by-id.js';
import { CreateUserUseCase } from './src/use-cases/create-user.js';
import { DeleteUserUseCase } from './src/use-cases/delete-user.js';
import { GetUserByIdUseCase } from './src/use-cases/get-user-by-id.js';

const app = express();

app.use(express.json());

app.get('/api/users/:userId', async (request, response) => {
    const getUserByIdRepository = new PostgresGetUserByIdRepository();

    const getUserByIdUseCase = new GetUserByIdUseCase(getUserByIdRepository);

    const getUserByIdController = new GetUserByIdController(getUserByIdUseCase);

    request.params.userId;
    const { statusCode, body } = await getUserByIdController.execute(request);

    response.status(statusCode).send(body);
});

app.post('/api/users', async (request, response) => {
    const createUserRepository = new PostgresCreateUserRepository();

    const createUserUseCase = new CreateUserUseCase(createUserRepository);

    const createUserController = new CreateUserController(createUserUseCase);

    const { statusCode, body } = await createUserController.execute(request);

    response.status(statusCode).send(body);
});

app.patch('/api/users/:userId', async (request, response) => {
    const updateUserController = new UpdateUserController();

    const { statusCode, body } = await updateUserController.execute(request);

    response.status(statusCode).send(body);
});

app.delete('/api/users/:userId', async (request, response) => {
    const deleteUserRepository = new PostgresDeleteUserRepository();

    const deleteUserUseCase = new DeleteUserUseCase(deleteUserRepository);

    const deleteUserController = new DeleteUserController(deleteUserUseCase);

    const { statusCode, body } = await deleteUserController.execute(request);

    response.status(statusCode).send(body);
});
app.listen(process.env.PORT, () => {
    const url = `http://localhost:${process.env.PORT}`;

    console.log(`Servidor Rodando em \x1b]8;;${url}\x1b\\${url}\x1b]8;;\x1b\\`);
});
