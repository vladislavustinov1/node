const logger = require("../logs/logger");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
require("dotenv").config();

function passportFunctionGoogle(passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:80/auth/google/callback",
        passReqToCallback: true,
      },
      function (request, accessToken, refreshToken, profile, done) {
        logger.info(`Получили профиль от Google ${profile}`);
        return done(null, profile);
      }
    )
  );
}

module.exports = passportFunctionGoogle;
