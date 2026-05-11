const { faker } = require('@faker-js/faker');
import { EmailAlreadyInUseError } from '../../errors/user.js';
import { CreateUserUseCase } from './create-user.js';
describe('Create User Use Case', () => {
    class GetUserByEmailRepositoryStub {
        async execute() {
            return null;
        }
    }

    class CreateUserRepositoryStub {
        async execute(user) {
            return user;
        }
    }

    class PasswordHaserAdapterStub {
        async execute() {
            return 'hashed_password';
        }
    }

    class IdGeneratorAdapterStub {
        execute() {
            return 'generated_id';
        }
    }

    const user = {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
            length: 7,
        }),
    };

    const makeSut = () => {
        const getUserByEmailRepositoryStub = new GetUserByEmailRepositoryStub();
        const createUserRepositoryStub = new CreateUserRepositoryStub();
        const passwordHaserAdapterStub = new PasswordHaserAdapterStub();
        const idGeneratorAdapterStub = new IdGeneratorAdapterStub();

        const sut = new CreateUserUseCase(
            getUserByEmailRepositoryStub,
            createUserRepositoryStub,
            passwordHaserAdapterStub,
            idGeneratorAdapterStub,
        );

        return {
            sut,
            getUserByEmailRepositoryStub,
            createUserRepositoryStub,
            passwordHaserAdapterStub,
            idGeneratorAdapterStub,
        };
    };

    it('should successfully create a user', async () => {
        const { sut } = makeSut();

        const createdUser = await sut.execute(user);

        expect(createdUser).toBeTruthy();
    });

    it('should throw an EmailAlreadyInUseError if GetUserByEmailRepository returns a user', async () => {
        const { sut, getUserByEmailRepositoryStub } = makeSut();
        jest.spyOn(getUserByEmailRepositoryStub, 'execute').mockReturnValueOnce(
            user,
        );

        const promise = sut.execute(user);

        await expect(promise).rejects.toThrow(
            new EmailAlreadyInUseError(user.email),
        );
    });
});
