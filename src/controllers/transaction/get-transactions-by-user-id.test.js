import { faker } from '@faker-js/faker';
import { GetTransactionsByUserIdController } from './get-transactions-by-user-id.js';
describe('Get Transaction By User ID Controller ', () => {
    class GetTransactionsByUserIdUseCaseStub {
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
        const getTransactionsByUserIdUseCase =
            new GetTransactionsByUserIdUseCaseStub();
        const sut = new GetTransactionsByUserIdController(
            getTransactionsByUserIdUseCase,
        );

        return { sut, getTransactionsByUserIdUseCase };
    };

    it('should return 200 when finding transaction by user id successfully', async () => {
        const { sut } = makeSut();

        const response = await sut.execute({
            query: { userId: faker.string.uuid() },
        });

        expect(response.statusCode).toBe(200);
    });

    it('should return 400 when missing userId param', async () => {
        const { sut } = makeSut();

        const response = await sut.execute({
            query: { userId: undefined },
        });

        expect(response.statusCode).toBe(400);
    });
});
