import { addUser, getUserRepository } from "../db";
import { generateAccessToken } from "../helpers";
const bcrypt = require('bcryptjs');

class AuthController {
  async registration(req, res){
    try{
        const { userName, userPass, age } = req.body;

        if (!(userName && userPass)) {
            return res.json({
                status: 'error'
            });
        }
        const users = await getUserRepository();
        const user = await users.find({where: {firstName: userName, age: age}});

        if (!user) {
          return res.status(400).json({message: 'This User already exists'});
        }
        await addUser({userName, userPass, age});

        return res.status(200).json('New user created');
      } catch(e) {
          return res.status(500).json(e);
      }
  };
  async login(req, res){
    try{
      const { userPass, userName } = req.body;
      const users = await getUserRepository();
      const user: any = await users.findOne({where: {firstName: userName}});

      const token = generateAccessToken(user.id, user.role, user.firstName);

      if(!user) {
        return res.status(400).json({message: `User ${userName} does not exists`});
      }
      const isValidPass = bcrypt.compareSync(userPass, user.passwd);
      if (!isValidPass){
        return res.status(400).json({message: `Password for user ${userName} is not correct`});
      }
      
      return res.json({
          status: 'OK',
          token
      });
      } catch(e) {
          return res.status(500).json(e);
      }
  };
}

export default new AuthController();