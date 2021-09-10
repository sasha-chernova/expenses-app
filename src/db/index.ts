// const md5 = require('md5');
const bcrypt = require('bcryptjs');
import { Expense } from './entities/Expense';
import { User } from './entities/User';
import { getDBConnection as getDB } from './typeorm';

export async function getUserRepository() {
  return (await getDB()).getRepository(User);
}

async function getExpenseRepository() {
  return (await getDB()).getRepository(Expense);
}

export async function getDBExpenses(): Promise<Expense[]> {
  const expensesRepository = await getExpenseRepository();

  return expensesRepository.find({});
}

export async function getDBUsers(): Promise<User[]> {
  const usersRepository = await getUserRepository();

  return usersRepository.find({});
}

export { getDB };

export const getAllowedUsers = async () => {
  return getDBUsers();
};

export const addUser = async (user: { userPass: string; userName: string, age: number }) => {
  const usersRepository = await getUserRepository();
  const hashedPassword = bcrypt.hashSync(user.userPass, 6);
  // const password = md5(user.userPass);
  usersRepository.save({
    firstName: user.userName,
    lastName: '-',
    passwd: hashedPassword,
    age: user.age,
  });
};

export const updateUser = async (userId: number, user: any) => {
  const usersRepository = await getUserRepository();
  return await usersRepository.update({id: userId}, user);

}

export const getUser = async (userId: number) => {
  const usersRepository = await getUserRepository();
  const user = await usersRepository.findOne({id: userId});

  return user;
}
export const deleteUser = async (userId: number) => {
  const usersRepository = await getUserRepository();
  const res = await usersRepository.delete({id: userId});
  return res;
}

export const getAllExpenses = async () => {
  return getDBExpenses();
}

export const getAllUserExpenses = async (userId: number) => {
  const expensesRepository = await getExpenseRepository();

  return expensesRepository.find({
    order: {
        id: "ASC"
    }, where: {userId}
  });

}
export const addExpenses = async (userId, expense) => {
  const expRepository = await getExpenseRepository();
  expRepository.save({
    purpose: expense.purpose,
    amount: expense.amount,
    time: Date.now(),
    userId: userId
  });
}
export const getUserExpenses = async(userId: number, exId: number) => {
  const expRepository = await getExpenseRepository();
  return expRepository.findOne({userId, id: exId}, {relations: ['user']});
}

export const updateUserExpenses = async (userId: number, exId: number, expense: any) => {
  const expRepository = await getExpenseRepository();
  return await expRepository.update({userId, id: exId}, expense);
}

export const deleteExpenses = async (userId: number, exId: number) => {
  const expRepository = await getExpenseRepository();
  return expRepository.delete({userId, id: exId});
}