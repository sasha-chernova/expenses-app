const fs = require('fs');
// Usefull `resolve` -> 'dir/dir/../../blah' => `./blah`
const {join, } = require('path');

// process - is object for interacting with system.
// It also contains all current process related data
// `child_process` lib -> parent process
// `cwd` -> full path to called file
const DB_BASEPATH = join(process.cwd(), 'db');

function getDBUsers() {
    if (!fs.existsSync(join(DB_BASEPATH, 'users.json'))) {
        fs.writeFileSync(join(DB_BASEPATH, 'users.json'), JSON.stringify([]));
    }

    // Replace in future
    const users = fs.readFileSync(join(DB_BASEPATH, 'users.json'));
    return JSON.parse(users.toString());
}

function getDBExpenses() {
    if (!fs.existsSync(join(DB_BASEPATH, 'expenses.json'))) {
        fs.writeFileSync(join(DB_BASEPATH, 'expenses.json'), JSON.stringify([]));
    }

    // Replace in future
    const expenses = fs.readFileSync(join(DB_BASEPATH, 'expenses.json'));
    return JSON.parse(expenses.toString());
}

module.exports = {
    getAllowedUsers: async () => {
        return getDBUsers();
    },
    addUser: (user) => {
        const users = getDBUsers();
        users.push({id: users.length + 1, ...user});
        fs.writeFileSync(join(DB_BASEPATH, 'users.json'), JSON.stringify(users));
    },
    updateUser: (userId, data) => {
        const users = getDBUsers();
        const currentUser = users.find(user => userId == user.id);
        if(!currentUser) {
            throw Error('Not found');
        };
        const updatedUser = {...currentUser, ...data};
        const updatedUsers = users.filter(user => userId != user.id);
        fs.writeFileSync(join(DB_BASEPATH, 'users.json'), JSON.stringify([...updatedUsers, {...currentUser, ...updatedUser}]));
    },
    getUser: (userId) => {
        const users = getDBUsers();
        const currentUser = users.find(user => userId == user.id);
        if(!currentUser) {
            throw Error('Not found');
        };
        return currentUser;
    },
    deleteUser: (userId) => {
        const users = getDBUsers();
        const currentUser = users.find(user => userId == user.id);
        if(!currentUser) throw Error('Not found');

        const updatedUsers = users.filter(user => userId != user.id);
        fs.writeFileSync(join(DB_BASEPATH, 'users.json'), JSON.stringify(updatedUsers));
    },
    getAllExpenses: async () => {
        return getDBExpenses();
    },
    getAllUserExpenses: (userId) => {
        const allExpenses = getDBExpenses();
        const userExpenses = allExpenses.filter(exp => exp.userId == userId);
        return userExpenses;
    },
    addExpenses: (userId, data) => {
        const expenses = getDBExpenses();
        const newExpense = {...data, userId};
        expenses.push({id: expenses.length + 1, ...newExpense});
        fs.writeFileSync(join(DB_BASEPATH, 'expenses.json'), JSON.stringify(expenses));
    },
    deleteExpenses: (userId, expensesId) => {
        if(!userId && !expensesId) throw Error('Not found');
        const allExpenses = getDBExpenses();
        const userExpenses = allExpenses.filter(exp => exp.userId == userId);
        const otherUsersExp = allExpenses.filter(exp => exp.userId != userId);
        const updatedExpenses = userExpenses.filter(exp => expensesId != exp.id);
        fs.writeFileSync(join(DB_BASEPATH, 'expenses.json'), JSON.stringify([...otherUsersExp, ...updatedExpenses]));
    },
    getUserExpenses: (userId, expensesId) => {
        const allExpenses = getDBExpenses();
        const result = allExpenses.find(exp => exp.userId == userId && exp.id == expensesId);
        if(!result) throw Error('Not found');
        return result;
    },
    updateUserExpenses: (userId, expensesId, data) => {
        const allExpenses = getDBExpenses();
        const currentExpenses = allExpenses.find(exp => exp.userId == userId && exp.id == expensesId);
        const updatedExpenses = {...currentExpenses, ...data};
        const otherExp = allExpenses.filter(exp => exp.id != expensesId);
        fs.writeFileSync(join(DB_BASEPATH, 'expenses.json'), JSON.stringify([...otherExp, updatedExpenses]));
    }
}
