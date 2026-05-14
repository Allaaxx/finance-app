const { faker } = require('@faker-js/faker');
import { GetUserByIdUseCase } from './get-user-by-id.js';

describe('Get User By Id Use Case', () => {
    const user = {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
            length: 7,
        }),
    };
    class GetUserByIdRepositoryStub {
        async execute() {
            return user;
        }
    }

    const makeSut = () => {
        const getUserByIdRepository = new GetUserByIdRepositoryStub();
        const sut = new GetUserByIdUseCase(getUserByIdRepository);

        return {
            sut,
            getUserByIdRepository,
        };
    };

    it('should get user by id successfully', async () => {
        const { sut } = makeSut();

        const result = await sut.execute(faker.string.uuid());

        expect(result).toEqual(user);
    });
});
