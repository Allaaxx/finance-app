import { faker } from '@faker-js/faker';
import { CreateTransactionController } from './create-transaction.js';
describe('Create Transaction Controller', () => {
    class createTransactionUseCaseStub {
        async execute(transaction) {
            return transaction;
        }
    }

    const makeSut = () => {
        const createTransactionUseCase = new createTransactionUseCaseStub();
        const sut = new CreateTransactionController(createTransactionUseCase);

        return {
            sut,
            createTransactionUseCase,
        };
    };
    const baseHttpRequest = {
        body: {
            user_id: faker.string.uuid(),
            name: faker.commerce.productName(10),
            date: faker.date.anytime().toISOString(),
            type: 'EXPENSE',
            amount: Number(faker.finance.amount()),
        },
    };

    it('should return 201 when creating transaction successfully (expense)', async () => {
        const { sut } = makeSut();

        const response = await sut.execute(baseHttpRequest);

        expect(response.statusCode).toBe(201);
    });

    it('should return 201 when creating transaction successfully (earning)', async () => {
        const { sut } = makeSut();

        const response = await sut.execute({
            body: {
                ...baseHttpRequest.body,
                type: 'EARNING',
            },
        });

        expect(response.statusCode).toBe(201);
    });

    it('should return 400 when missing user_id', async () => {
        const { sut } = makeSut();

        const response = await sut.execute({
            body: {
                ...baseHttpRequest,
                user_id: undefined,
            },
        });

        expect(response.statusCode).toBe(400);
    });

    it('should return 400 when missing name', async () => {
        const { sut } = makeSut();

        const response = await sut.execute({
            body: {
                ...baseHttpRequest,
                name: undefined,
            },
        });

        expect(response.statusCode).toBe(400);
    });

    it('should return 400 when missing type', async () => {
        const { sut } = makeSut();

        const response = await sut.execute({
            body: {
                ...baseHttpRequest,
                type: undefined,
            },
        });

        expect(response.statusCode).toBe(400);
    });

    it('should return 400 when missing amount', async () => {
        const { sut } = makeSut();

        const response = await sut.execute({
            body: {
                ...baseHttpRequest,
                amount: undefined,
            },
        });

        expect(response.statusCode).toBe(400);
    });

    it('should return 400 when date is invalid', async () => {
        const { sut } = makeSut();

        const response = await sut.execute({
            body: {
                ...baseHttpRequest,
                date: 'invalid_date',
            },
        });

        expect(response.statusCode).toBe(400);
    });

    it('should return 400 when type is not EXPENSE, EARNING or INVESTMENT', async () => {
        const { sut } = makeSut();

        const response = await sut.execute({
            body: {
                ...baseHttpRequest,
                type: 'invalid_type',
            },
        });

        expect(response.statusCode).toBe(400);
    });
});
