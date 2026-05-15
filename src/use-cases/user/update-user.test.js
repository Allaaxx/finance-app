import { faker } from '@faker-js/faker';
import { UpdateUserUseCase } from './update-user.js';

describe('Update User Use Case', () => {
    const user = {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
            length: 7,
        }),
    };

    class GetUserByEmailRepositoryStub {
        async execute() {
            return null;
        }
    }

    class PasswordHasherAdapterStub {
        async execute() {
            return 'hashed_password';
        }
    }

    class UpdateUserRepositoryStub {
        async execute() {
            return user;
        }
    }

    const makeSut = () => {
        const getUserByEmailRepository = new GetUserByEmailRepositoryStub();
        const updateUserRepository = new UpdateUserRepositoryStub();
        const passwordHasherAdapter = new PasswordHasherAdapterStub();
        const sut = new UpdateUserUseCase(
            getUserByEmailRepository,
            updateUserRepository,
            passwordHasherAdapter,
        );

        return {
            sut,
            getUserByEmailRepository,
            updateUserRepository,
            passwordHasherAdapter,
        };
    };
    it('should update user successfully (without email and password)', async () => {
        const { sut } = makeSut();

        const result = await sut.execute(faker.string.uuid(), {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
        });

        expect(result).toBe(user);
    });

    it('should update user successfully (with email)', async () => {
        const { sut, getUserByEmailRepository } = makeSut();
        const getUserByEmailRepositorySpy = jest.spyOn(
            getUserByEmailRepository,
            'execute',
        );

        const email = faker.internet.email();
        const result = await sut.execute(faker.string.uuid(), {
            email,
        });

        expect(getUserByEmailRepositorySpy).toHaveBeenCalledWith(email);
        expect(result).toBe(user);
    });

    it('should update user successfully (with password)', async () => {
        const { sut, passwordHasherAdapter } = makeSut();
        const passwordHasherAdapterSpy = jest.spyOn(
            passwordHasherAdapter,
            'execute',
        );

        const password = faker.internet.password();
        const result = await sut.execute(faker.string.uuid(), {
            password,
        });

        expect(passwordHasherAdapterSpy).toHaveBeenCalledWith(password);
        expect(result).toBe(user);
    });
});
