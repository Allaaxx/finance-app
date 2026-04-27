import { faker } from '@faker-js/faker';
import { GetTransactionsByUserIdController } from './get-transactions-by-user-id.js';
describe('Get Transaction By User ID Controller ', () => {
    class GetUserByIdUseCaseStub {
        execute() {
            return {
                user_id: faker.string.uuid(),
                id: faker.string.uuid(),
                name: faker.commerce.productName(),
                date: faker.date.anytime().toISOString(),
                type: 'EXPENSE',
                amount: Number(faker.finance.amount()),
            };
        }
    }

    const makeSut = () => {
        const getUserByIdUseCase = new GetUserByIdUseCaseStub();
        const sut = new GetTransactionsByUserIdController();

        return { sut, getUserByIdUseCase };
    };

    it('should return 200 when finding transaction by user id successfully', async () => {
        const { sut } = makeSut();

        const response = await sut.execute({
            query: { userId: faker.string.uuid() },
        });

        expect(response.statusCode).toBe(200);
    });
});
