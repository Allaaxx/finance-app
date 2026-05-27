import { user } from '../../../tests';
import { PostgresCreateUserRepository } from './create-user';

describe('Create User Repository', () => {
    it('should create a user on db', async () => {
        const sut = new PostgresCreateUserRepository();
        const result = await sut.execute(user);

        expect(result).not.toBeNull();
    });
});
