const User = require("../models/users");

module.exports = (req, res, next) => {
  if (!req.session.name) {
    return next();
  }
  User.findByEmail(req.session.email, (err, userDatas) => {
    if (err) return next(err);
    if (userDatas) req.user = res.locals.user = userDatas;
    next();
  });
};
