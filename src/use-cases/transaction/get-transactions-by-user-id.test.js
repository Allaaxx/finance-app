import { faker } from '@faker-js/faker';
import { GetTransactionByUserIdUseCase } from './get-transactions-by-user-id.js';
describe('Get Transactions By User Id Use Case', () => {
    const user = {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
            length: 7,
        }),
    };
    class GetTransactionByUserIdRepositoryStub {
        async execute() {
            return [];
        }
    }

    class GetUserByIdRepositoryStub {
        async execute() {
            return user;
        }
    }

    const makeSut = () => {
        const getTransactionsByUserIdRepository =
            new GetTransactionByUserIdRepositoryStub();
        const getUserByIdRepository = new GetUserByIdRepositoryStub();
        const sut = new GetTransactionByUserIdUseCase(
            getTransactionsByUserIdRepository,
            getUserByIdRepository,
        );

        return {
            sut,
            getTransactionsByUserIdRepository,
            getUserByIdRepository,
        };
    };

    it('should get transactions by user id successfully', async () => {
        const { sut } = makeSut();

        const result = await sut.execute(faker.string.uuid());

        expect(result).toEqual([]);
    });
});
