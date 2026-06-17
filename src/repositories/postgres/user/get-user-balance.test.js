import { faker } from '@faker-js/faker';
import { prisma } from '../../../../prisma/prisma'
import { user } from '../../../tests'
import { PostgresGetUserBalanceRepository } from "./get-user-balance";
describe('Get User Balance Repository', () => {
    it('should get user balance on db', async () => {
        await prisma.user.create({ data: user })
        await prisma.transaction.createMany({
            data: [
                {
                    name: faker.string.sample(),
                    amount: 5000,
                    date: faker.date.recent(),
                    type: 'EARNING',
                    user_id: user.id,
                },
                {
                    name: faker.string.sample(),
                    amount: 5000,
                    date: faker.date.recent(),
                    type: 'EARNING',
                    user_id: user.id,
                },
                {
                    name: faker.string.sample(),
                    amount: 1000,
                    date: faker.date.recent(),
                    type: 'EXPENSE',
                    user_id: user.id,
                },
                {
                    name: faker.string.sample(),
                    amount: 1000,
                    date: faker.date.recent(),
                    type: 'EXPENSE',
                    user_id: user.id,
                },
                {
                    name: faker.string.sample(),
                    amount: 3000,
                    date: faker.date.recent(),
                    type: 'INVESTMENT',
                    user_id: user.id,
                },
                {
                    name: faker.string.sample(),
                    amount: 3000,
                    date: faker.date.recent(),
                    type: 'INVESTMENT',
                    user_id: user.id,
                }
            ]
        });

        const sut = new PostgresGetUserBalanceRepository();

        const result = await sut.execute(user.id);

        expect(result.earnigs.toString()).toBe('10000');
        expect(result.expense.toString()).toBe('2000');
        expect(result.investments.toString()).toBe('6000');
        expect(result.balance.toString()).toBe('2000');
    });

    it('should call Prisma with correct params', async () => {
        const sut = new PostgresGetUserBalanceRepository();
        const prismaSpy = jest.spyOn(prisma.transaction, 'aggregate');

        await sut.execute(user.id);

        expect(prismaSpy).toHaveBeenCalledTimes(3);
        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                user_id: user.id,
                type: 'EXPENSE',
            },
            _sum: {
                amount: true,
            }
        })
        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                user_id: user.id,
                type: 'EARNING',
            },
            _sum: {
                amount: true,
            }
        })
        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                user_id: user.id,
                type: 'INVESTMENT',
            },
            _sum: {
                amount: true,
            }
        })
    })
})