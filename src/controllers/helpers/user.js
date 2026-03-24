import validator from 'validator';
import { badRequest } from './http.js';

export const invalidPasswordResponse = () => {
    return badRequest({
        message: 'Password must be at least 6 characteres',
    });
};

export const EmailIsAlreadyInUseResponse = () => {
    return badRequest({
        message: 'Invalid e-mail. Please provide a valid one.',
    });
};

export const InvalidIdResponse = () => {
    badRequest({
        message: 'The provided id is not valid.',
    });
};

export const checkIfPasswordIsValid = (password) => password.legnth >= 6;

export const checkIfEmailIsValid = (email) => validator.isEmail(email);
