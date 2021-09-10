const jwt = require('jsonwebtoken');
/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const authorizeAdminMiddleware = async (req, res, next) => {
  if (req.method === 'OPTIONS') {
    next()
  }
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(403).json({status: 'This user is not allowed to perform this action'});
    }
    const { role } = jwt.verify(token, process.env.TOKEN_KEY);
    if (role !== 'SITE_ADMIN') {
      return res.status(403).json({status: 'This user is not allowed to perform this action'});
    }
    next();
  } catch(e) {
    return res.status(403).json({status: 'This user is not allowed to perform this action'});
  }
  // const currentUser: any = await getCurrentUser(req);
  // if (currentUser && currentUser.role == 'SITE_ADMIN') {
  //     return next();
  // }
  // res.status(403);
  // return res.json({status: 'This user is not allowed to perform this action'});
}

export const authorizeMiddleware = async (req, res, next) => {
  if (req.method === 'OPTIONS') {
    next()
  }
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(403).json({status: 'User is not authorized'});
    }
    const tokenDecoded = jwt.verify(token, process.env.TOKEN_KEY);
    req.user = tokenDecoded;
    next();
  } catch(e) {
    return res.status(403).json({status: 'User is not authorized'});
  }
  // const currentUser: any = await getCurrentUser(req);
  // if (currentUser) {
  //     return next();
  // }

} 