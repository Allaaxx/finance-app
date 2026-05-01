import { faker } from '@faker-js/faker';
import { UserNotFoundError } from '../../errors/user.js';
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
        const sut = new GetTransactionsByUserIdController(getUserByIdUseCase);

        return { sut, getUserByIdUseCase };
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

    it('should return 400 when userId is invalid', async () => {
        const { sut } = makeSut();

        const response = await sut.execute({
            query: { userId: 'invalid_user_id' },
        });

        expect(response.statusCode).toBe(400);
    });

    it('should return 404 when GetUserByIdUseCase throws UserNotFoundError', async () => {
        const { sut, getUserByIdUseCase } = makeSut();
        jest.spyOn(getUserByIdUseCase, 'execute').mockRejectedValueOnce(
            new UserNotFoundError(),
        );

        const response = await sut.execute({
            query: { userId: faker.string.uuid() },
        });

        expect(response.statusCode).toBe(404);
    });

    it('should return 500 when GetUserByIdUseCase throws generic error', async () => {
        const { sut, getUserByIdUseCase } = makeSut();
        jest.spyOn(getUserByIdUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        );

        const response = await sut.execute({
            query: { userId: faker.string.uuid() },
        });

        expect(response.statusCode).toBe(500);
    });
});
