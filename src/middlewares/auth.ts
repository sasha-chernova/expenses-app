import { User } from '../db/entities/User';
import { getCurrentUser } from './../helpers';
/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const authorizeAdminMiddleware = async (req, res, next) => {
  const currentUser: any = await getCurrentUser(req);
  if (currentUser && currentUser.role == 'SITE_ADMIN') {
      return next();
  }
  res.status(403);
  return res.json({status: 'This user is not allowed to perform this action'});
}

export const authorizeMiddleware = async (req, res, next) => {
  const currentUser: any = await getCurrentUser(req);
  if (currentUser) {
      return next();
  }

  return res.status(403).json({status: 'User is not authorized'});
} 