import { v4 as uuidv4 } from 'uuid';
import { EmailAlreadyInUseError } from '../../errors/user.js';

export class CreateUserUseCase {
    constructor(
        getUserByEmailRepository,
        createUserRepository,
        passwordHasherAdapter,
    ) {
        this.getUserByEmailRepository = getUserByEmailRepository;
        this.createUserRepository = createUserRepository;
        this.passwordHasherAdapter = passwordHasherAdapter;
    }

    async execute(createUserParams) {
        const userWithProvideEmail =
            await this.getUserByEmailRepository.execute(createUserParams.email);

        if (userWithProvideEmail) {
            throw new EmailAlreadyInUseError(createUserParams.email);
        }

        const userId = uuidv4();

        const hashedPassword = await this.passwordHasherAdapter.execute(
            createUserParams.password,
        );

        const user = {
            ...createUserParams,
            id: userId,
            password: hashedPassword,
        };

        const createdUser = this.createUserRepository.execute(user);

        return createdUser;
    }
}
