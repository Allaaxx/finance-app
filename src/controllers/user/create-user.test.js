import { CreateUserController } from './create-user.js';
describe('Create User Controller', () => {
    class CreateUserUseCaseStub {
        execute(user) {
            return user;
        }
    }
    it('should return 201 when creating an user successfully', async () => {
        const createUserUseCase = new CreateUserUseCaseStub();
        const createUserController = new CreateUserController(
            createUserUseCase,
        );

        const httpRequest = {
            body: {
                first_name: 'Allan',
                last_name: 'Silva',
                email: 'allan@example.com',
                password: '123456',
            },
        };

        const result = await createUserController.execute(httpRequest);

        expect(result.statusCode).toBe(201);
        expect(result.body).toBe(httpRequest.body);
    });

    it('should return 400 if first_name is not provided', async () => {
        const createUserUseCase = new CreateUserUseCaseStub();
        const createUserController = new CreateUserController(
            createUserUseCase,
        );
        const httpRequest = {
            body: {
                last_name: 'Silva',
                email: 'allan@example.com',
                password: '123456',
            },
        };

        const result = await createUserController.execute(httpRequest);

        expect(result.statusCode).toBe(400);
    });

    it('should return 400 if last_name is not provided', async () => {
        const createUserUseCase = new CreateUserUseCaseStub();
        const createUserController = new CreateUserController(
            createUserUseCase,
        );
        const httpRequest = {
            body: {
                first_name: 'Allan',
                email: 'allan@example.com',
                password: '123456',
            },
        };

        const result = await createUserController.execute(httpRequest);

        expect(result.statusCode).toBe(400);
    });

    it('should return 400 if email is not provided', async () => {
        const createUserUseCase = new CreateUserUseCaseStub();
        const createUserController = new CreateUserController(
            createUserUseCase,
        );
        const httpRequest = {
            body: {
                first_name: 'Allan',
                last_name: 'Silva',
                password: '123456',
            },
        };

        const result = await createUserController.execute(httpRequest);

        expect(result.statusCode).toBe(400);
    });

    it('should return 400 if email is not valid', async () => {
        const createUserUseCase = new CreateUserUseCaseStub();
        const createUserController = new CreateUserController(
            createUserUseCase,
        );
        const httpRequest = {
            body: {
                first_name: 'Allan',
                email: 'al.com',
                last_name: 'Silva',
                password: '123456',
            },
        };

        const result = await createUserController.execute(httpRequest);

        expect(result.statusCode).toBe(400);
    });

    it('should return 400 if password is not provided', async () => {
        const createUserUseCase = new CreateUserUseCaseStub();
        const createUserController = new CreateUserController(
            createUserUseCase,
        );
        const httpRequest = {
            body: {
                first_name: 'Allan',
                email: 'allan@example.com',
                last_name: 'Silva',
            },
        };

        const result = await createUserController.execute(httpRequest);

        expect(result.statusCode).toBe(400);
    });

    it('should return 400 if password is less than 6 characters', async () => {
        const createUserUseCase = new CreateUserUseCaseStub();
        const createUserController = new CreateUserController(
            createUserUseCase,
        );
        const httpRequest = {
            body: {
                first_name: 'Allan',
                email: 'allan@example.com',
                last_name: 'Silva',
                password: '12',
            },
        };

        const result = await createUserController.execute(httpRequest);

        expect(result.statusCode).toBe(400);
    });

    it('should call CreateUserUseCase with correct params', async () => {
        const createUserUseCase = new CreateUserUseCaseStub();
        const createUserController = new CreateUserController(
            createUserUseCase,
        );
        const httpRequest = {
            body: {
                first_name: 'Allan',
                last_name: 'Rodrigues',
                email: 'allan@example.com',
                password: '12345678',
            },
        };

        const executeSpy = jest.spyOn(createUserUseCase, 'execute');

        await createUserController.execute(httpRequest);

        expect(executeSpy).toHaveBeenCalledWith(httpRequest.body);
    });
});
