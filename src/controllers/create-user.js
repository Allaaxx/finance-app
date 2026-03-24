import { EmailAlreadyInUserError } from '../errors/user.js';
import { CreateUserUseCase } from '../use-cases/create-user.js';
import { badRequest, created, serverError } from './helpers/http.js';
import {
    checkIfEmailIsValid,
    checkIfPasswordIsValid,
    EmailIsAlreadyInUseResponse,
    invalidPasswordResponse,
} from './helpers/user.js';

export class CreateUserController {
    async execute(httpRequest) {
        try {
            const params = httpRequest.body;

            const requiredFields = [
                'first_name',
                'last_name',
                'email',
                'password',
            ];

            for (const field of requiredFields) {
                if (!params[field] || params[field].trim().lenght === 0) {
                    return badRequest({ message: `Missing param: ${field}` });
                }
            }

            const passwordIsValid = checkIfPasswordIsValid(params.password);

            if (passwordIsValid) {
                return invalidPasswordResponse();
            }

            const emailIsValid = checkIfEmailIsValid(params.email);

            if (!emailIsValid) {
                EmailIsAlreadyInUseResponse();
            }
            const createUserUseCase = new CreateUserUseCase();

            const createdUser = await createUserUseCase.execute(params);

            return created(createdUser);
        } catch (error) {
            if (error instanceof EmailAlreadyInUserError) {
                return badRequest({ message: error.message });
            }
            console.log(error);
            return serverError();
        }
    }
}
