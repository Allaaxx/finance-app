import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { EmailAlreadyInUseError } from '../../errors/user.js';

export class CreateUserUseCase {
    constructor(getUserByEmailRepository, createUserRepository) {
        this.getUserByEmailRepository = getUserByEmailRepository;
        this.createUserRepository = createUserRepository;
    }

    async execute(createUserParams) {
        const userWithProvideEmail =
            await this.getUserByEmailRepository.execute(createUserParams.email);

        if (userWithProvideEmail) {
            throw new EmailAlreadyInUseError(createUserParams.email);
        }

        const userId = uuidv4();

        const hashedPassword = await bcrypt.hash(createUserParams.password, 10);

        const user = {
            ...createUserParams,
            id: userId,
            password: hashedPassword,
        };

        const createdUser = this.createUserRepository.execute(user);

        return createdUser;
    }
}
