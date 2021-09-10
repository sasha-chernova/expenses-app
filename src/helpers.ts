import { getAllowedUsers, getUserRepository } from './db';
const  passport = require('passport');
const jwt = require('jsonwebtoken');
const JwtStrategy = require('passport-jwt').Strategy,
ExtractJwt = require('passport-jwt').ExtractJwt;

export const getCurrentUser = async (req) => {
  const users = await getAllowedUsers();
  // const currentUser = users
  // .filter(({ firstName, passwd }) => `${firstName}:${passwd}` === req.headers.authorization);
  const currentUser = users
  .filter(({ firstName }) => req.headers.authorization.includes(`${firstName}`));

  return currentUser[0];
}
export const getCurrentUserId = async (req) => {
  const opts: any = {}
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = process.env.TOKEN_KEY;
  const jwtStrategy = passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    const usersRepository = await getUserRepository();
 
    await usersRepository.findOne({id: jwt_payload.id})
      .then(user => {
        if(user) {
          return done(null, user);
        }
        return done(null, false);
      })
      .catch(err => console.error(err));
  }));
  console.log('jwtStrategy', jwtStrategy)
}
export const generateAccessToken = (id, role, name) => {
  const payload = {
    id, role, name
  };
  return jwt.sign(payload, process.env.TOKEN_KEY, {expiresIn: '12h', algorithm: 'RS256'});
}