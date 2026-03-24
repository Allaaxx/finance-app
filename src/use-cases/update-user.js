import bcrypt from 'bcrypt';
import { EmailAlreadyInUserError } from '../errors/user.js';
import {
    PostgresgetUserByEmailRepository,
    PostgresUpdateUserRepository,
} from '../repositories/postgres/index.js';

export class UpdateUserUseCase {
    async execute(userId, updateUserParams) {
        if (updateUserParams.email) {
            const postgresGetUserByEmailRepository =
                new PostgresgetUserByEmailRepository();

            const userWithProvideEmail =
                await postgresGetUserByEmailRepository.execute(
                    updateUserParams.email,
                );

            if (userWithProvideEmail && userWithProvideEmail.id != userId) {
                throw new EmailAlreadyInUserError(updateUserParams.email);
            }
        }

        const user = {
            ...updateUserParams,
        };

        if (updateUserParams.password) {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            user.password = hashedPassword;
        }

        const postgresUpdateUserRepository = new PostgresUpdateUserRepository();

        const updateUser = await postgresUpdateUserRepository.execute(
            userId,
            user,
        );

        return updateUser;
    }
}
