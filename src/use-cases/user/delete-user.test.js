import { faker } from '@faker-js/faker';
import { DeleteUserUseCase } from './delete-user.js';

describe('Delete User Use Case', () => {
    const user = {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
            length: 7,
        }),
    };

    class DeleteUserRepositoryStub {
        async execute() {
            return user;
        }
    }

    const makeSut = () => {
        const deleteUserRepository = new DeleteUserRepositoryStub();
        const sut = new DeleteUserUseCase(deleteUserRepository);

        return {
            sut,
            deleteUserRepository,
        };
    };

    it('should successfully delete a user', async () => {
        const { sut } = makeSut();

        const deletedUser = await sut.execute(faker.string.uuid());

        expect(deletedUser).toEqual(user);
    });

    it('should call DeleteUserRepository with correct params ', async () => {
        const { sut, deleteUserRepository } = makeSut();
        const executeSpy = jest.spyOn(deleteUserRepository, 'execute');
        const userId = faker.string.uuid();

        await sut.execute(userId);

        expect(executeSpy).toHaveBeenCalledWith(userId);
    });
});
