import bcrypt from 'bcrypt';
import { EmailAlreadyInUserError } from '../errors/user.js';
import { PostgresgetUserByEmailRepository } from '../repositories/postgres/get-user-by-email.js';
import { PostgresUpdateUserRepository } from '../repositories/postgres/update-user.js';

export class UpdateUserUseCase {
    async execute(userId, updateUserParams) {
        if (updateUserParams.email) {
            const postgresGetUserByEmailRepository =
                new PostgresgetUserByEmailRepository();

            const userWithProvideEmail =
                await postgresGetUserByEmailRepository.execute(
                    updateUserParams.email,
                );

            if (userWithProvideEmail) {
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
            updateUserParams,
        );

        return updateUser;
    }
}
