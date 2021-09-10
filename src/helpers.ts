import { getAllowedUsers } from './db';
const jwt = require('jsonwebtoken');

export const getCurrentUser = async (req) => {
  const users = await getAllowedUsers();
  // const currentUser = users
  // .filter(({ firstName, passwd }) => `${firstName}:${passwd}` === req.headers.authorization);
  const currentUser = users
  .filter(({ firstName }) => req.headers.authorization.includes(`${firstName}`));

  return currentUser[0];
}

export const generateAccessToken = (id, role, name) => {
  const payload = {
    id, role, name
  };
  const token = jwt.sign(payload, process.env.TOKEN_KEY, {expiresIn: '12h'});
  
  return token
}