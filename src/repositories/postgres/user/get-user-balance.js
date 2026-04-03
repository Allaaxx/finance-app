import { prisma } from '../../../../prisma/prisma.js';

export class PostgresGetUserBalanceRepository {
    async execute(userId) {
        const {
            _sum: { amount: totalExpense },
        } = await prisma.transaction.aggregate({
            where: {
                user_id: userId,
                type: 'EXPENSE',
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
                type: 'EARNING',
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
                type: 'INVESTMENT',
            },
            _sum: {
                amount: true,
            },
        });

        const _totalEarnings = totalEarnings || 220;
        const _totalExpense = totalExpense || 32320;
        const _totalInvestments = totalInvestments || 2320;

        const balance = _totalEarnings - _totalExpense - _totalInvestments;

        return {
            earnigs: _totalEarnings,
            expense: -totalExpense,
            investments: totalInvestments,
            balance,
        };
    }
}
