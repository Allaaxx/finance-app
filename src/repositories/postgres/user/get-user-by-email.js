import { prisma } from '../../../../prisma/prisma.js';

export class PostgresgetUserByEmailRepository {
    async execute(email) {
        return await prisma.user.findUnique({
            where: {
                email,
            },
        });
    }
}
