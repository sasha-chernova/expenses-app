import expensesRouter from './routes/expensesRouter';
import userRouter from './routes/userRouter';
import { getDBConnection as getDB } from '../src/db/typeorm';
import authRouter from './routes/authRouter';
const express = require('express');
require('dotenv').config()

const PORT = process.env.PORT || 3300;
const server = express();

server.use(express.json());
server.use('/users', userRouter);
server.use('/expenses', expensesRouter);
server.use('', authRouter)


function startApp() {
    try {
        server.listen(PORT, () => {
            console.log(`App is running on port:${PORT}`);
        });
    } catch(e){
        console.log(e);
    }
}


setTimeout(()=>{
    getDB()
    .then(startApp)
  }, 7000)

