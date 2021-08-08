import { getAllowedUsers } from './db';

export const getCurrentUser = async (req) => {
  const users = await getAllowedUsers();
  const currentUser = users
  .filter(({ userName, userPass }) => `${userName}:${userPass}` === req.headers.authorization);
  return currentUser[0];
}