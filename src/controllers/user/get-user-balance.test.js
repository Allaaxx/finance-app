import { faker } from '@faker-js/faker';
import { GetUserBalanceController } from './get-user-balance';

describe('GetUserBalanceController', () => {
    class getUserBalanceUseCaseStub {
        async execute() {
            return faker.number.int();
        }
    }

    const makeSut = () => {
        const getUserBalanceUseCase = new getUserBalanceUseCaseStub();
        const sut = new GetUserBalanceController(getUserBalanceUseCase);

        return { sut, getUserBalanceUseCase };
    };

    const httpRequest = {
        params: {
            userId: faker.string.uuid(),
        },
    };

    it('should return 200 when getting user balance', async () => {
        const { sut } = makeSut();

        const httpResponse = await sut.execute(httpRequest);

        expect(httpResponse.statusCode).toBe(200);
    });

    it('should return 400 when userId is invalid', async () => {
        const { sut } = makeSut();

        const result = await sut.execute({
            params: {
                userId: 'invalid_id',
            },
        });

        expect(result.statusCode).toBe(400);
    });
});
