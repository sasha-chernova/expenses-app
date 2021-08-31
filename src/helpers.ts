import { getAllowedUsers } from './db';

export const getCurrentUser = async (req) => {
  const users = await getAllowedUsers();
  const currentUser = users
  .filter(({ firstName, passwd }) => `${firstName}:${passwd}` === req.headers.authorization);
  console.log(currentUser)

  return currentUser[0];
}