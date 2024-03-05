const STRATEGY = require("passport-jwt").Strategy;
const User = require("../models/users");
const logger = require("../logs/logger");

require("dotenv").config();

const cookieExtractor = function (req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["access_token"];
  }
  return token;
};
const options = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: process.env.SECRET_JWT,
};
function passportFunction(passport) {
  passport.use(
    new STRATEGY(options, function (jwt_payload, done) {
      User.findByEmail(jwt_payload.name, (err, user) => {
        if (err) throw err;
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      });
    })
  );
}
module.exports = passportFunction;
