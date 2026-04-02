import bcrypt from 'bcrypt';
import {
    EmailAlreadyInUserError,
    UserNotFoundError,
} from '../../errors/user.js';

export class UpdateUserUseCase {
    constructor(
        getUserByEmailRepository,
        updateUserRepository,
        getUserByIdRepository,
    ) {
        this.getUserByEmailRepository = getUserByEmailRepository;
        this.updateUserRepository = updateUserRepository;
        this.getUserByIdRepository = getUserByIdRepository;
    }

    async execute(userId, updateUserParams) {
        const user = await this.getUserByIdRepository.execute(userId);

        if (!user) {
            throw new UserNotFoundError(userId);
        }
        if (updateUserParams.email) {
            const userWithProvideEmail =
                await this.getUserByEmailRepository.execute(
                    updateUserParams.email,
                );

            if (userWithProvideEmail && userWithProvideEmail.id != userId) {
                throw new EmailAlreadyInUserError(updateUserParams.email);
            }
        }

        const userDataToUpdate = {
            ...updateUserParams,
        };

        if (updateUserParams.password) {
            const hashedPassword = await bcrypt.hash(
                updateUserParams.password,
                10,
            );
            userDataToUpdate.password = hashedPassword;
        }

        const updatedUser = await this.updateUserRepository.execute(
            userId,
            userDataToUpdate,
        );

        return updatedUser;
    }
}
