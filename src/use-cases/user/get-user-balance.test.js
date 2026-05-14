import { faker } from '@faker-js/faker';
import { UserNotFoundError } from '../../errors/user';
import { GetUserBalanceUseCase } from './get-user-balance.js';

describe('Get User Balance Use Case', () => {
    const userBalance = {
        earnings: faker.finance.amount(),
        expenses: faker.finance.amount(),
        investments: faker.finance.amount(),
        balance: faker.finance.amount(),
    };
    class GetUserBalanceRepositoryStub {
        async execute() {
            return userBalance;
        }
    }
    class GetUserByIdRepositoryStub {
        async execute() {
            return {
                id: faker.string.uuid(),
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({
                    length: 7,
                }),
            };
        }
    }

    const makeSut = () => {
        const getUserBalanceRepository = new GetUserBalanceRepositoryStub();
        const getUserByIdRepository = new GetUserByIdRepositoryStub();
        const sut = new GetUserBalanceUseCase(
            getUserBalanceRepository,
            getUserByIdRepository,
        );

        return {
            sut,
            getUserBalanceRepository,
            getUserByIdRepository,
        };
    };

    it('should get user balance successfully', async () => {
        const { sut } = makeSut();

        const promise = await sut.execute(faker.string.uuid());

        expect(promise).toEqual(userBalance);
    });

    it('should throw UserNotFoundError if GetUserByIdRepository returns null', async () => {
        const { sut, getUserByIdRepository } = makeSut();
        jest.spyOn(getUserByIdRepository, 'execute').mockResolvedValue(null);
        const userId = faker.string.uuid();

        const promise = sut.execute(userId);

        await expect(promise).rejects.toThrow(new UserNotFoundError(userId));
    });
});
