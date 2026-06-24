import 'dotenv/config.js';
import express from 'express';

import { usersRouter, transactionsRouter } from './src/routes/index.js';

export const app = express();

app.use(express.json());

app.use('/api/users', usersRouter)

app.use('/api/transactions', transactionsRouter)

app.listen(process.env.PORT, () => {
    const url = `http://localhost:${process.env.PORT}`;

    console.log(`Servidor Rodando em \x1b]8;;${url}\x1b\\${url}\x1b]8;;\x1b\\`);
});
