import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { EmailAlreadyInUserError } from '../errors/user.js';
import { PostgresCreateUserRepository } from '../repositories/postgres/create-user.js';
import { PostgresgetUserByEmailRepository } from '../repositories/postgres/get-user-by-email.js';

export class CreateUserUseCase {
    async execute(createUserParams) {
        const postgresGetUserByEmailRepository =
            new PostgresgetUserByEmailRepository();

        const userWithProvideEmail =
            await postgresGetUserByEmailRepository.execute(
                createUserParams.email,
            );

        if (userWithProvideEmail) {
            throw new EmailAlreadyInUserError(createUserParams.email);
        }

        const userId = uuidv4();

        const hashedPassword = await bcrypt.hash(createUserParams.password, 10);

        const user = {
            ...createUserParams,
            id: userId,
            password: hashedPassword,
        };

        const postgresCreateUserRepository = new PostgresCreateUserRepository();

        const createdUser = postgresCreateUserRepository.execute(user);

        return createdUser;
    }
}
