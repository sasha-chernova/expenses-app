import { 
  addUser, 
  getAllowedUsers, 
  updateUser, 
  deleteUser, 
  getUser, 
  getAllUserExpenses,
  deleteExpenses,
  updateUserExpenses,
  getUserExpenses
} from './../db';

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

class UserController{
  async create(req, res){
    try{
      const {userName, userPass} = req.body;
      if (!(userName && userPass)) {
          return res.json({
              status: 'error'
          });
      }
          await addUser({userName, userPass});
          return res.status(200).json('User created');
      } catch(e) {
          return res.status(500).json(e);
      }
  };

  async getAll(req, res){
    try{
      return res.json({
        status: 'OK',
        users: await getAllowedUsers()
      });
    } catch(e) {
      return res.status(500).json(e)
    } 
  };

  async updateUser(req, res){
    const userId = req.params.id;
    try {
        await updateUser(userId, req.body);
        return res.json({
            status: "OK"
        })
    } catch(err) {
        return res.json({
            status: "error"
        })
    }
  };

  async delete(req, res){
    try {
      await deleteUser(req.params.id);
      return res.json({
          status: "User was deleted"
      }) 
    } catch(err) {
      return res.json({
          status: "error"
      })
    }
  };

  async getCurrent(req, res){
    try {
      const userId = req.params.id;
    
      return res.json({
          status: 'OK',
          user: getUser(userId)
      });
    } catch(e) {
      return res.status(500).json(e)
    }
  }
  async getAllUserExpenses(req, res){
    try {
      const userId = req.params.id;
      return res.json({
          status: 'OK',
          expenses: await getAllUserExpenses(userId)
      });
    } catch(e) {
      return res.status(500).json(e)
    }
  };

  async getUserExpenses(req, res){
    try {
      const userId = req.params.id;
      const expensesId = req.params.expensesId;
      return res.json({
          status: 'OK',
          expenses: getUserExpenses(userId, expensesId)
      });
    } catch(e) {
      return res.status(500).json(e);
    }
  }

  async deleteUserExpenses(req, res){
    try {
      const expensesId = req.params.id;
      const userId = req.params.userId;
      deleteExpenses(userId, expensesId)
      return res.json({
          status: 'OK',
      });
    } catch(e) {
      return res.status(500).json(e)
    }
  }

  async updateUserExpenses(req, res){
    try {
      const expensesId = req.params.id;
      const userId = req.params.userId;
      updateUserExpenses(userId, expensesId, req.body);
      return res.json({
          status: 'OK',
      });
    } catch(e) {
      return res.status(500).json(e)
    }
  }
}

export default new UserController();