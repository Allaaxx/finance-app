import { Prisma, TransactionType } from '@prisma/client';
import { prisma } from '../../../../prisma/prisma.js';

export class PostgresGetUserBalanceRepository {
    async execute(userId) {
        const {
            _sum: { amount: totalExpense },
        } = await prisma.transaction.aggregate({
            where: {
                user_id: userId,
                type: TransactionType.EXPENSE,
            },
            _sum: {
                amount: true,
            },
        });

        const {
            _sum: { amount: totalEarnings },
        } = await prisma.transaction.aggregate({
            where: {
                user_id: userId,
                type: TransactionType.EARNING,
            },
            _sum: {
                amount: true,
            },
        });

        const {
            _sum: { amount: totalInvestments },
        } = await prisma.transaction.aggregate({
            where: {
                user_id: userId,
                type: TransactionType.INVESTMENT,
            },
            _sum: {
                amount: true,
            },
        });

        const _totalEarnings = totalEarnings || new Prisma.Decimal(0);
        const _totalExpense = totalExpense || new Prisma.Decimal(0);
        const _totalInvestments = totalInvestments || new Prisma.Decimal(0);

        const balance = new Prisma.Decimal(
            _totalEarnings - _totalExpense - _totalInvestments,
        );

        return {
            earnings: _totalEarnings,
            expenses: _totalExpense,
            investments: _totalInvestments,
            balance,
        };
    }
}
