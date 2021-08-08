// import { userRouter, expensesRouter } from "./routes";
import expensesRouter from './routes/expensesRouter';
import userRouter from './routes/userRouter';
const express = require('express');

const PORT = '3000';
const server = express();

server.use(express.json());
server.use('/users', userRouter);
server.use('/expenses', expensesRouter);


function startApp() {
    try {
        server.listen(PORT, () => {
            console.log(`App is running on port:${PORT}`);
        });
    } catch(e){
        console.log(e);
    }
}
startApp();

