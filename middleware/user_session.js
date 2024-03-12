const User = require("../models/users");

module.exports = (req, res, next) => {
  if (req.session.name) {
    User.findByEmail(req.session.email, (err, userDatas) => {
      if (err) return next(err);
      if (userDatas) req.user = res.locals.user = userDatas[0];
      next();
    });
  } else if (req.session.passport) {
    res.locals.user = req.session.passport.user;
    console.log(res.locals.user);
    next();
  } else {
    return next();
  }
};
