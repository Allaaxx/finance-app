import { CreateTransactionController } from '../../controllers';
import { makeCreateTransactionController } from './transaction';

describe('Transaction Controller Factory', () => {
    it('should return a valid CreateTransactionController instance', () => {
        expect(makeCreateTransactionController()).toBeInstanceOf(
            CreateTransactionController,
        );
    });
});