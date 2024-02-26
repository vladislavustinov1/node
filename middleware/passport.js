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
  secretKey: process.env.SECRET_JWT,
};
