import { userNotFoundResponse } from '../../controllers/helpers/index.js';

export class GetTransactionByUserId {
    constructor(getTransactionByUserIdRepository, getUserByIdRepository) {
        this.getTransactionByUserIdRepository =
            getTransactionByUserIdRepository;
        this.getUserByIdRepository = getUserByIdRepository;
    }
    async execute(params) {
        const user = await this.getUserByIdRepository.execute(params.userId);

        if (!user) {
            return userNotFoundResponse();
        }

        const transactions =
            await this.getTransactionByUserIdRepository.execute(params.userId);

        return transactions;
    }
}
