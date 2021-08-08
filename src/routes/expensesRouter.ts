const express = require('express')
const expensesRouter = express.Router();

import { authorizeMiddleware } from '../middlewares/auth';
import ExpensesController from '../controllers/ExpensesController';

expensesRouter.post('', authorizeMiddleware, ExpensesController.create);
expensesRouter.get('', authorizeMiddleware, ExpensesController.getAll);

expensesRouter.get('/:id', authorizeMiddleware, ExpensesController.getCurrent)
expensesRouter.put('/:id', authorizeMiddleware, ExpensesController.update)
expensesRouter.delete('/:id', authorizeMiddleware, ExpensesController.delete)

export default expensesRouter;