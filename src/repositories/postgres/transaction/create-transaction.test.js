import dayjs from "dayjs"
import { prisma } from "../../../../prisma/prisma"
import { transaction, user as fakeUser } from "../../../tests"
import { PostgresCreateTransactionRepository } from "./create-transaction"

describe('Postgres Create Transaction Repository', () => {
    it('should create transaction on db', async () => {
        const user = await prisma.user.create({ data: fakeUser })
        const sut = new PostgresCreateTransactionRepository()

        const result = await sut.execute({ ...transaction, user_id: user.id })

        expect(result.name).toBe(transaction.name)
        expect(result.type).toBe(transaction.type)
        expect(result.user_id).toBe(user.id)
        expect(String(result.amount)).toBe(String(transaction.amount))
        expect(dayjs(result.date).daysInMonth()).toBe(
            dayjs(transaction.date).daysInMonth()
        )
        expect(dayjs(result.date).month()).toBe(dayjs(transaction.date).month())
        expect(dayjs(result.date).year()).toBe(dayjs(transaction.date).year())
    })
})