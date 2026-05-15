import { faker } from '@faker-js/faker';
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
});
