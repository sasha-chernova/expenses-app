const express = require('express');
const { 
    getAllowedUsers,
    addUser, 
    updateUser, 
    deleteUser,
    getAllExpenses, 
    addExpenses, 
    getAllUserExpenses,
    deleteExpenses,
    getUserExpenses,
    updateUserExpenses,
 } = require('./db');

const server = express();

server.use(express.json());

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const homepageController = (req, res) => {
    res.json({
        status: 'OK'
    });
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const actionController = (req, res) => {
    res.json({
        status: 'OK',
        method: req.method,
        body: req.body
    });
}

async function getCurrentUser(req) {
    const users = await getAllowedUsers();
    const currentUser = users
    .filter(({ userName, userPass }) => `${userName}:${userPass}` === req.headers.authorization);
    return currentUser[0];
}

const authorizeAdminMiddleware = async (req, res, next) => {
    const currentUser = await getCurrentUser(req);
    if (currentUser && currentUser.roles && currentUser.roles.includes('SITE_ADMIN')) {
        return next();
    }
    res.status(403);
    return res.json({status: 'error'});
}

const authorizeMiddleware = async (req, res, next) => {
    const currentUser = await getCurrentUser(req);
    if (currentUser) {
        return next();
    }
    res.status(403);
    return res.json({status: 'error'});
}

server.get('', homepageController);

/**
 * /expenses (get,put,post,delete) Table expenses contain user ID, get expenses, should use current(be headers) user ID
 * (Admin[roles=[SITE_ADMIN]]) - should see skip userID check
 */

const actionsRoute = express.Router();
actionsRoute.use('', authorizeMiddleware);
actionsRoute.get('', actionController);
actionsRoute.post('', actionController);
actionsRoute.put('', actionController);
actionsRoute.patch('', actionController);
server.use('/actions', actionsRoute);

server.post('/users', authorizeAdminMiddleware, (req, res) => {
    const {userName, userPass} = req.body;
    if (!(userName && userPass)) {

        return res.json({
            status: 'error'
        });
    }
    addUser({userName, userPass});
    return res.json({
        status: 'OK'
    });
});
server.get('/users', authorizeAdminMiddleware, async (req, res) => {
    return res.json({
        status: 'OK',
        users: await getAllowedUsers()
    });
});

server.put('/users/:id', authorizeAdminMiddleware, async (req, res) => {
    const userId = req.params.id;
    try {
        updateUser(userId, req.body);
        return res.json({
            status: "OK"
        })
    } catch(err) {
        return res.json({
            status: "error"
        })
    }
})
server.delete('/users/:id', authorizeAdminMiddleware, async (req, res) => {
    deleteUser(req.params.id);
    return res.json({
        status: "OK"
    })
})

server.listen('3000', () => {
    console.log('OK');
});

//
const expensesController = (req, res) => {
    res.json({
        status: 'OK',
        statusCode: 200,
        // method: req.method,
        // body: req.body
    });
}

const currentUserExpensesController = (req, res) => {
    res.json({
        status: 'OK',
        statusCode: 200
    });
}
const expensesRoute = express.Router();
expensesRoute.use('', authorizeMiddleware);
expensesRoute.get('', expensesController);
server.get('/expenses', authorizeMiddleware, async (req, res) => {
    const currentUser = await getCurrentUser(req);
    const isAdmin = currentUser.roles && currentUser.roles.includes('SITE_ADMIN');

    return res.json({
        status: 'OK',
        expenses: isAdmin ? await getAllExpenses() : getAllUserExpenses(currentUser.id)
    });
});
server.post('/expenses', authorizeMiddleware, async (req, res) => {
    const currentUser = await getCurrentUser(req);
    addExpenses(currentUser.id, req.body)
    return res.json({
        status: 'OK'
    });
});
server.delete('/expenses/:id', authorizeMiddleware, async (req, res) => {
    const expensesId = req.params.id;
    const currentUser = await getCurrentUser(req);
    deleteExpenses(currentUser.id, expensesId);
    return res.json({
        status: 'OK'
    });
});
server.get('/expenses/:id', authorizeMiddleware, async (req, res) => {
    const expensesId = req.params.id;
    const currentUser = await getCurrentUser(req);
    
    return res.json({
        status: 'OK',
        expenses: getUserExpenses(currentUser.id, expensesId)
    });
});
server.put('/expenses/:id', authorizeMiddleware, async (req, res) => {
    const expensesId = req.params.id;
    const currentUser = await getCurrentUser(req);
    updateUserExpenses(currentUser.id, expensesId, req.body);
    return res.json({
        status: 'OK',
    });
});
server.use('/expenses', expensesRoute);

const userUrl = '/user/:id/expenses';

server.get(userUrl, authorizeAdminMiddleware, async (req, res) => {
    const userId = req.params.id;
    return res.json({
        status: 'OK',
        expenses: getAllUserExpenses(userId)
    });
});
server.get('/user/:userId/expenses/:id', authorizeAdminMiddleware, async (req, res) => {
    const expensesId = req.params.id;
    const userId = req.params.userId;
    return res.json({
        status: 'OK',
        expenses: getUserExpenses(userId, expensesId)
    });
});

server.delete('/user/:userId/expenses/:id', authorizeAdminMiddleware, async (req, res) => {
    const expensesId = req.params.id;
    const userId = req.params.userId;
    deleteExpenses(userId, expensesId)
    return res.json({
        status: 'OK',
    });
});
server.put('/user/:userId/expenses/:id', authorizeAdminMiddleware, async (req, res) => {
    const expensesId = req.params.id;
    const userId = req.params.userId;
    updateUserExpenses(userId, expensesId, req.body);
    return res.json({
        status: 'OK',
    });
});
// const currentUserExpensesRoute = express.Router();
// currentUserExpensesRoute.use('', authorizeAdminMiddleware);
// server.use(userUrl, currentUserExpensesRoute);
// currentUserExpensesRoute.get(userUrl, currentUserExpensesController);
// currentUserExpensesRoute.post('', currentUserExpensesController);
// currentUserExpensesRoute.put('', currentUserExpensesController);
// currentUserExpensesRoute.delete('', currentUserExpensesController);