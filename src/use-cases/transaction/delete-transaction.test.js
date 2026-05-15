import { faker } from '@faker-js/faker';
import { DeleteTransactionUseCase } from './delete-transaction.js';

describe('Delte Transaction Use Case', () => {
    const transaction = {
        user_id: faker.string.uuid(),
        name: faker.commerce.productName(10),
        date: faker.date.anytime().toISOString(),
        type: 'EXPENSE',
        amount: Number(faker.finance.amount()),
    };

    class DeleteTransactionRepositoryStub {
        async execute(transactionId) {
            return {
                ...transaction,
                id: transactionId,
            };
        }
    }
    const makeSut = () => {
        const deleteTransactionRepository =
            new DeleteTransactionRepositoryStub();
        const sut = new DeleteTransactionUseCase(deleteTransactionRepository);

        return {
            sut,
            deleteTransactionRepository,
        };
    };

    it('should delete a transaction successfully', async () => {
        const { sut } = makeSut();
        const id = faker.string.uuid();

        const result = await sut.execute(id);

        expect(result).toEqual({
            ...transaction,
            id,
        });
    });

    it('should call DeleteTransactionRepository with correct params', async () => {
        const { sut, deleteTransactionRepository } = makeSut();
        const deleteTransactionRepositorySpy = jest.spyOn(
            deleteTransactionRepository,
            'execute',
        );
        const id = faker.string.uuid();

        await sut.execute(id);

        expect(deleteTransactionRepositorySpy).toHaveBeenCalledWith(id);
    });

    it('should throw if DeleteTransactionRepository throws', async () => {
        const { sut, deleteTransactionRepository } = makeSut();
        jest.spyOn(
            deleteTransactionRepository,
            'execute',
        ).mockRejectedValueOnce(new Error());
        const id = faker.string.uuid();

        const promise = sut.execute(id);

        await expect(promise).rejects.toThrow();
    });
});
