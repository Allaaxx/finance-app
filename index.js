import 'dotenv/config.js';
import express from 'express';

const app = express();

app.use(express.json());

app.listen(process.env.PORT, () => {
    const url = `http://localhost:${process.env.PORT}`;

    console.log(`Servidor Rodando em \x1b]8;;${url}\x1b\\${url}\x1b]8;;\x1b\\`);
});
