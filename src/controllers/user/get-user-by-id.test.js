const { faker } = require('@faker-js/faker');
import { GetUserByIdController } from './get-user-by-id.js';
describe('GetUserByIdController', () => {
    class GetUserByIdUseCaseStub {
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
        const GetUserByIdUseCase = new GetUserByIdUseCaseStub();

        const sut = new GetUserByIdController(GetUserByIdUseCase);

        return { sut, GetUserByIdUseCase };
    };

    const baseHttpRequest = {
        params: {
            userId: faker.string.uuid(),
        },
    };

    it('should return 200 if a user is found', async () => {
        const { sut } = makeSut();

        const result = await sut.execute(baseHttpRequest);

        expect(result.statusCode).toBe(200);
    });

    it('should return 400 if an invalid id is provided', async () => {
        const { sut } = makeSut();

        const response = await sut.execute({
            params: {
                userId: 'invalid_id',
            },
        });

        expect(response.statusCode).toBe(400);
    });

    it('should return 404 if user is not found', async () => {
        const { sut, GetUserByIdUseCase } = makeSut();
        jest.spyOn(GetUserByIdUseCase, 'execute').mockResolvedValue(null);

        const response = await sut.execute(baseHttpRequest);

        expect(response.statusCode).toBe(404);
    });

    it('should return 500 if GetUserByIdUseCase throws', async () => {
        const { sut, GetUserByIdUseCase } = makeSut();
        jest.spyOn(GetUserByIdUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        );

        const response = await sut.execute(baseHttpRequest);

        expect(response.statusCode).toBe(500);
    });

    it('should call GetUserByIdUseCase with correct values', async () => {
        const { sut, GetUserByIdUseCase } = makeSut();

        const executeSpy = jest.spyOn(GetUserByIdUseCase, 'execute');

        await sut.execute(baseHttpRequest);

        expect(executeSpy).toHaveBeenCalledWith(baseHttpRequest.params.userId);
    });
});
