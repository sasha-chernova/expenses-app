import { addExpenses, getAllExpenses, getAllUserExpenses, getUserExpenses, updateUserExpenses, deleteExpenses } from '../db';

class ExpensesController {
  async create(req, res){
    try{
      addExpenses(req.user.id, req.body)
      return res.json({
          status: 'OK'
      });
      } catch(e) {
          return res.status(500).json(e);
      }
  };
  async getAll(req, res){
    try{
      const isAdmin = req.user.role && req.user.role == 'SITE_ADMIN';

      return res.json({
          status: 'OK',
          expenses: isAdmin ? await getAllExpenses() : await getAllUserExpenses(req.user.id)
      });
    } catch(e) {
      return res.status(500).json(e)
    }
      
  };
  async update(req, res){
    try {
      const expensesId = req.params.id;
      return res.json({
          status: 'OK',
          expense: updateUserExpenses(req.user.id, expensesId, req.body)
      });
    } catch(err) {
        return res.json({
            status: "error"
        })
    }
  };
  async delete(req, res){
    try {
      const expensesId = req.params.id;
      await deleteExpenses(req.user.id, expensesId);
      return res.json({
          status: 'OK'
      });
    } catch(err) {
      return res.json({
          status: "error"
      })
    }
  };
  async getCurrent(req, res){
    try {
      const expensesId = req.params.id;
      const userId = req.params.userId || req.user.id;
      const expense = await getUserExpenses(userId, expensesId);
      if(expense) {
        return res.json({
          status: 'OK',
          expense
        });
      } else {
        return res.status(404).json(`Expense with id ${expensesId} is absent`)
      }
      
    } catch(e) {
      return res.status(500).json(e)
    }
  }
}

export default new ExpensesController();