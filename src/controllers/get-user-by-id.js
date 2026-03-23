import validator from 'validator';
import { GetUserByIdUseCase } from '../use-cases/get-user-by-id.js';
import { badRequest, notFound, ok, serverError } from './helpers.js';

export class GetUserByIdController {
    async execute(httpRequest) {
        try {
            const isIdValid = validator.isUUID(httpRequest.params.userId);

            if (!isIdValid) {
                return badRequest({
                    message: 'The provided id is not valid',
                });
            }

            const getUserByIdUseCase = new GetUserByIdUseCase();

            const user = await getUserByIdUseCase.execute(
                httpRequest.params.userId,
            );

            if (!user) {
                return notFound({
                    message: 'User not Found',
                });
            }

            return ok(user);
        } catch (error) {
            console.error(error);
            return serverError();
        }
    }
}
