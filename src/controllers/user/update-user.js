import { ZodError } from 'zod';
import {
    EmailAlreadyInUserError,
    UserNotFoundError,
} from '../../errors/user.js';
import { updatedUserSchema } from '../../schemas/user.js';
import { badRequest, ok, serverError } from '../helpers/http.js';
import {
    checkIfIdIsValid,
    invalidIdResponse,
    userNotFoundResponse,
} from '../helpers/index.js';
export class UpdateUserController {
    constructor(updateUserUseCase) {
        this.updateUserUseCase = updateUserUseCase;
    }
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId;

            const isIdValid = checkIfIdIsValid(userId);

            if (!isIdValid) {
                return invalidIdResponse();
            }

            const params = httpRequest.body;

            await updatedUserSchema.parseAsync(params);

            const updatedUser = await this.updateUserUseCase.execute(
                userId,
                params,
            );

            return ok(updatedUser);
        } catch (error) {
            if (error instanceof ZodError) {
                return badRequest({
                    message: error.issues[0].message,
                });
            }
            if (error instanceof EmailAlreadyInUserError) {
                return badRequest({ message: error.message });
            }
            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse();
            }
            console.error(error);
            return serverError();
        }
    }
}
