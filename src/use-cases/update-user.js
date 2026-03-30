import bcrypt from 'bcrypt';
import { EmailAlreadyInUserError } from '../errors/user.js';

export class UpdateUserUseCase {
    constructor(getUserByEmailRepository, updateUserRepository) {
        this.getUserByEmailRepository = getUserByEmailRepository;
        this.updateUserRepository = updateUserRepository;
    }

    async execute(userId, updateUserParams) {
        if (updateUserParams.email) {
            const userWithProvideEmail =
                await this.getUserByEmailRepository.execute(
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

        const updateUser = await this.updateUserRepository.execute(
            userId,
            user,
        );

        return updateUser;
    }
}
