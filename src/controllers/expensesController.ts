import { addExpenses, getAllExpenses, getAllUserExpenses } from '../db';
import { deleteExpenses, getUserExpenses, updateUserExpenses } from './../db_mock';
import { getCurrentUser, getCurrentUserId } from './../helpers';

class ExpensesController {
  async create(req, res){
    try{
      const currentUser: any = await getCurrentUser(req);
      const currentUserId: number = await getCurrentUserId(req);
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
      const currentUser: any = await getCurrentUser(req);
      // const isAdmin = currentUser.role && currentUser.role == 'SITE_ADMIN';
const isAdmin = true;
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
      const currentUser: any = await getCurrentUser(req);
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
      const currentUser: any = await getCurrentUser(req);
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
      const currentUser: any= await getCurrentUser(req);
      
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