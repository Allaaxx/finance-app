import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { prisma } from '../../../../prisma/prisma.js';
import { UserNotFoundError } from '../../../errors/user.js';
export class PostgresDeleteUserRepository {
    async execute(userId) {
        try {
            return await prisma.user.delete({
                where: {
                    id: userId,
                },
            });
            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new UserNotFoundError(userId)
                }
            }

            throw error;
        }
    }
}
