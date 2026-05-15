import { faker } from '@faker-js/faker';
import { UserNotFoundError } from '../../errors/user';
import { CreateTransactionUseCase } from './create-transaction';

describe('Create Transaction Use Case', () => {
    const user = {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
            length: 7,
        }),
    };

    const CreateTransactionParams = {
        user_id: faker.string.uuid(),
        name: faker.commerce.productName(10),
        date: faker.date.anytime().toISOString(),
        type: 'EXPENSE',
        amount: Number(faker.finance.amount()),
    };

    class CreateTransactionRepositoryStub {
        async execute(transaction) {
            return transaction;
        }
    }

    class IdGeneratorAdapterStub {
        execute() {
            return 'random_id';
        }
    }

    class GetUserByIdRepositoryStub {
        execute(userId) {
            return { ...user, id: userId };
        }
    }

    const makeSut = () => {
        const createTransactionRepository =
            new CreateTransactionRepositoryStub();
        const idGeneratorAdapter = new IdGeneratorAdapterStub();
        const getUserByIdRepository = new GetUserByIdRepositoryStub();
        const sut = new CreateTransactionUseCase(
            createTransactionRepository,
            getUserByIdRepository,
            idGeneratorAdapter,
        );

        return {
            sut,
            createTransactionRepository,
            idGeneratorAdapter,
            getUserByIdRepository,
        };
    };

    it('should create transaction successfully', async () => {
        const { sut } = makeSut();

        const result = await sut.execute(CreateTransactionParams);

        expect(result).toEqual({ ...CreateTransactionParams, id: 'random_id' });
    });

    it('should call GetUserByIdRepository with correct params', async () => {
        const { sut, getUserByIdRepository } = makeSut();
        const getUserByIdRepositorySpy = jest.spyOn(
            getUserByIdRepository,
            'execute',
        );

        await sut.execute(CreateTransactionParams);

        expect(getUserByIdRepositorySpy).toHaveBeenCalledWith(
            CreateTransactionParams.user_id,
        );
    });

    it('should call IdGeneratorAdapter', async () => {
        const { sut, idGeneratorAdapter } = makeSut();
        const idGeneratorAdapterSpy = jest.spyOn(idGeneratorAdapter, 'execute');

        await sut.execute(CreateTransactionParams);

        expect(idGeneratorAdapterSpy).toHaveBeenCalled();
    });

    it('should call createTransactionRepository with correct params', async () => {
        const { sut, createTransactionRepository } = makeSut();
        const createTransactionRepositorySpy = jest.spyOn(
            createTransactionRepository,
            'execute',
        );

        await sut.execute(CreateTransactionParams);

        expect(createTransactionRepositorySpy).toHaveBeenCalledWith({
            ...CreateTransactionParams,
            id: 'random_id',
        });
    });

    it('should throw UserNotFoundError if user does not exist', async () => {
        const { sut, getUserByIdRepository } = makeSut();
        jest.spyOn(getUserByIdRepository, 'execute').mockResolvedValueOnce(
            null,
        );

        const promise = sut.execute(CreateTransactionParams);

        await expect(promise).rejects.toThrow(
            new UserNotFoundError(CreateTransactionParams.user_id),
        );
    });

    it('should throw if GetUserByIdRepository throws', async () => {
        const { sut, getUserByIdRepository } = makeSut();
        jest.spyOn(getUserByIdRepository, 'execute').mockRejectedValueOnce(
            new Error(),
        );

        const promise = sut.execute(CreateTransactionParams);

        await expect(promise).rejects.toThrow();
    });

    it('should throw if IdGeneratorAdapter throws', async () => {
        const { sut, idGeneratorAdapter } = makeSut();
        jest.spyOn(idGeneratorAdapter, 'execute').mockImplementationOnce(() => {
            throw new Error();
        });

        const promise = sut.execute(CreateTransactionParams);

        await expect(promise).rejects.toThrow();
    });

    it('should throw if CreateTransactionRepository throws', async () => {
        const { sut, createTransactionRepository } = makeSut();
        jest.spyOn(
            createTransactionRepository,
            'execute',
        ).mockRejectedValueOnce(new Error());

        const promise = sut.execute(CreateTransactionParams);

        await expect(promise).rejects.toThrow();
    });
});
