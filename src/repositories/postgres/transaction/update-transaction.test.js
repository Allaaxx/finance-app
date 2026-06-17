import { prisma } from "../../../../prisma/prisma"
import { PostgresUpdateTransactionRepository } from './update-transaction'
import { transaction, user } from '../../../tests'
import { faker } from '@faker-js/faker'
import { TransactionType } from '@prisma/client'
import dayjs from "dayjs"



describe('Postgres Update Transaction Repository', () => {
    it('should update a transaction', async () => {
        await prisma.user.create({ data: user })
        await prisma.transaction.create(
            {
                data:
                    { ...transaction, user_id: user.id }
            }
        )
        const sut = new PostgresUpdateTransactionRepository()

        const params = {
            user_id: user.id,
            name: faker.commerce.productName(),
            date: faker.date.anytime().toISOString(),
            type: TransactionType.EXPENSE,
            amount: Number(faker.finance.amount())
        }

        const result = await sut.execute(transaction.id, params)

        expect(result.name).toBe(params.name)
        expect(result.type).toBe(params.type)
        expect(result.user_id).toBe(user.id)
        expect(String(result.amount)).toBe(String(params.amount))
        expect(dayjs(result.date).daysInMonth()).toBe(
            dayjs(params.date).daysInMonth()
        )
        expect(dayjs(result.date).month()).toBe(dayjs(params.date).month())
        expect(dayjs(result.date).year()).toBe(dayjs(params.date).year())
    })

    it('shoul call Pirsma with correct params', async () => {
        await prisma.user.create({ data: user })
        await prisma.transaction.create(
            { data: { ...transaction, user_id: user.id } }
        )
        const sut = new PostgresUpdateTransactionRepository()
        const prismaSpy = jest.spyOn(prisma.transaction, 'update')

        await sut.execute(transaction.id, { ...transaction, user_id: user.id })

        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                id: transaction.id,
            },
            data: { ...transaction, user_id: user.id },
        })
    })
})