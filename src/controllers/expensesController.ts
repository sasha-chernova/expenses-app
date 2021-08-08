import { getAllExpenses, getAllUserExpenses, addExpenses, deleteExpenses, getUserExpenses, updateUserExpenses } from './../db';
import { getCurrentUser } from './../helpers';

class ExpensesController {
  async create(req, res){
    try{
      const currentUser = await getCurrentUser(req);
      addExpenses(currentUser.id, req.body)
      return res.json({
          status: 'OK'
      });
      } catch(e) {
          return res.status(500).json(e);
      }
  };
  async getAll(req, res){
    try{
      const currentUser = await getCurrentUser(req);
      const isAdmin = currentUser.roles && currentUser.roles.includes('SITE_ADMIN');
    
      return res.json({
          status: 'OK',
          expenses: isAdmin ? await getAllExpenses() : getAllUserExpenses(currentUser.id)
      });
    } catch(e) {
      return res.status(500).json(e)
    }
      
  };
  async update(req, res){
    const userId = req.params.id;
    try {
      const expensesId = req.params.id;
      const currentUser = await getCurrentUser(req);
      updateUserExpenses(currentUser.id, expensesId, req.body);
      return res.json({
          status: 'OK',
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
      const currentUser = await getCurrentUser(req);
      deleteExpenses(currentUser.id, expensesId);
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
      const currentUser = await getCurrentUser(req);
      
      return res.json({
          status: 'OK',
          expenses: getUserExpenses(currentUser.id, expensesId)
      });
    } catch(e) {
      return res.status(500).json(e)
    }
  }
}

export default new ExpensesController();