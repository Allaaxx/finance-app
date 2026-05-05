import { UserNotFoundError } from '../../errors/user.js';

export class CreateTransactionUseCase {
    constructor(
        createTransactionRepository,
        getUserByIdRepository,
        idGeneratorAdapter,
    ) {
        this.createTransactionRepository = createTransactionRepository;
        this.getUserByIdRepository = getUserByIdRepository;
        this.idGeneratorAdapter = idGeneratorAdapter;
    }

    async execute(params) {
        const userId = params.user_id;

        const user = await this.getUserByIdRepository.execute(userId);

        if (!user) {
            throw new UserNotFoundError(userId);
        }

        const transactionId = this.idGeneratorAdapter.execute();

        const transaction = await this.createTransactionRepository.execute({
            ...params,
            id: transactionId,
        });

        return transaction;
    }
}
