const { User } = require("../config/config");

module.exports = async (req, res, next) => {
  if (req.session.name) {
    const user = await User.findOne({ where: { email: req.session.email } });
    if (!user) return next(new Error("Невозможно найти пользователя"));
    if (user) {
      req.user = res.locals.user = user;
      res.locals.user.entryType = "form";
    }
    return next();
  } else if (req.session.passport) {
    res.locals.user = req.session.passport.user;
    res.locals.user.entryType = "passport";
    return next();
  } else {
    return next();
  }
};
