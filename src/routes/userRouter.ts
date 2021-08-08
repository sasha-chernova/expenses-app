const express = require('express');
const userRouter = express.Router();

import { authorizeAdminMiddleware } from '../middlewares/auth';
import UserController from '../controllers/userController';

userRouter.post('', authorizeAdminMiddleware, UserController.create);
userRouter.get('', authorizeAdminMiddleware, UserController.getAll);

userRouter.get('/:id', authorizeAdminMiddleware, UserController.getCurrent);
userRouter.put('/:id', authorizeAdminMiddleware, UserController.updateUser);
userRouter.delete('/:id', authorizeAdminMiddleware, UserController.delete);

const certainUserExpensesUrl =  '/:id/expenses';
userRouter.get(certainUserExpensesUrl, authorizeAdminMiddleware, UserController.getAllUserExpenses);
userRouter.get(certainUserExpensesUrl + '/:expensesId', authorizeAdminMiddleware, UserController.getUserExpenses);
userRouter.put(certainUserExpensesUrl + '/:expensesId', authorizeAdminMiddleware, UserController.updateUserExpenses);
userRouter.delete(certainUserExpensesUrl + '/:expensesId', authorizeAdminMiddleware, UserController.deleteUserExpenses);

export default userRouter;