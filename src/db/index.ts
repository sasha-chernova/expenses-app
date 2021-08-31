const md5 = require('md5');

import { User } from './entities/User';
import { getDBConnection as getDB } from './typeorm';

async function getUserRepository() {
  return (await getDB()).getRepository(User);
}

export async function getDBUsers(): Promise<User[]> {
  const usersRepository = await getUserRepository();

  return usersRepository.find({});
}

export { getDB };

export const getAllowedUsers = async () => {
  return getDBUsers();
};

export const addUser = async (user: { userPass: string; userName: string }) => {
  const usersRepository = await getUserRepository();
  const password = md5(user.userPass);
  usersRepository.save({
    firstName: user.userName,
    lastName: '-',
    passwd: password,
  });
};
