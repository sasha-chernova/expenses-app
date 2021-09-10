const express = require('express')
const authRouter = express.Router();

import AuthController from '../controllers/authController';

authRouter.post('/registration', AuthController.registration);
authRouter.post('/login', AuthController.login);

export default authRouter;