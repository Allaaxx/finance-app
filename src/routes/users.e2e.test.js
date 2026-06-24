import request from 'supertest';
import { app } from '../..'
import { user } from '../tests/fixtures/user.js'

describe('Users Routes E2E Tests', () => {
    it('POST /users should return 201 when user is created', async () => {
        const response = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            }).expect(201)
    })
})
