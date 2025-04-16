import bcrypt from 'bcryptjs';
import passport from 'passport';
import { prisma } from './prisma.js';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { retrieveUserById, retrieveUserByEmail } from '../controller/prismadb.js';

const customFields = {
    usernameField: 'email',
    passwordField: 'password'
}
  
// Local Strategy for authentication
async function verifyLocalCallback(email, password, done) {
    try {
      const user = await retrieveUserByEmail(email);
  
      if (!user) {
        return done(null, false, { message: "Incorrect email/password" });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      }
  
      return done(null, user);
  
    } catch(err) {
      return done(err);
    }
}
const localStrategy = new LocalStrategy(customFields, verifyLocalCallback);
  
// Serializers for local strategy signin and signout
passport.serializeUser((user, done) => {
    done(null, user.id);
});
  
passport.deserializeUser(async (id, done) => {
    try {
      const user = await prisma.driveUser.findUnique({
          where: { id: id }
      });
      done(null, user);
    } catch(err) {
      done(err);
    }
});


// JWT Strategy for protecting routes
async function verifyJWTCallback(payload, done) {
    try {
      const user = await retrieveUserById(payload.id)
      
      // There's no need to verify the password since the JWT verified the user id
      if (!user) {
        return done(null, false, { message: "Forbidden" });
      } else {
        return done(null, user)
      };
    } catch(err) {
      return done(err);
    }
}
const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_ACCESS_SECRET
}

const jwtStrategy = new JwtStrategy(options, verifyJWTCallback);

passport.use(localStrategy);
passport.use(jwtStrategy);

export { passport }