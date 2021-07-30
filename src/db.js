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

module.exports = {
    getAllowedUsers: async () => {
        return getDBUsers();
    },
    addUser: (user) => {
        const users = getDBUsers();
        users.push({id: users.length + 1, ...user});
        fs.writeFileSync(join(DB_BASEPATH, 'users.json'), JSON.stringify(users));
    }
}
