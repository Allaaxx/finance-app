import { EmailAlreadyInUserError } from '../../errors/user.js';
import {
    badRequest,
    checkIfEmailIsValid,
    checkIfPasswordIsValid,
    created,
    emailIsAlreadyInUseResponse,
    invalidPasswordResponse,
    serverError,
    validateRequiredFields,
} from '../helpers/index.js';

export class CreateUserController {
    constructor(createUserUseCase) {
        this.createUserUseCase = createUserUseCase;
    }
    async execute(httpRequest) {
        try {
            const params = httpRequest.body;

            const requiredFields = [
                'first_name',
                'last_name',
                'email',
                'password',
            ];

            const { ok: requiredFieldsWereProvided, missingField } =
                validateRequiredFields(params, requiredFields);

            if (!requiredFieldsWereProvided) {
                return badRequest({
                    message: `The field ${missingField} is rquired.`,
                });
            }

            const passwordIsValid = checkIfPasswordIsValid(params.password);

            if (!passwordIsValid) {
                return invalidPasswordResponse();
            }

            const emailIsValid = checkIfEmailIsValid(params.email);

            if (!emailIsValid) {
                return emailIsAlreadyInUseResponse();
            }

            const createdUser = await this.createUserUseCase.execute(params);

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
