const logger = require("../logs/logger");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
require("dotenv").config();

function passportFunctionGoogle(passport) {
  passport.serializeUser((user, done) => {
    console.log(`\n--------> Serialize User:`);
    console.log(user);
    const newUser = {
      id: user.id,
      username: user.displayName,
      email: user.emails[0].value,
      age: user.birthday ? Date.now() - user.birthday : 20,
    };
    done(null, newUser);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/callback",
        passReqToCallback: true,
      },
      function (request, accessToken, refreshToken, profile, done) {
        logger.info(`Получили профиль от Google ${profile.name}`);
        return done(null, profile);
      }
    )
  );
}

module.exports = passportFunctionGoogle;
