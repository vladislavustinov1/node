const User = require("../models/user");
exports.form = (req, res) => {
  const username = req.session.name;
  res.render("loginForm", { name: username });
};

exports.submit = (req, res, next) => {
  User.findByEmail(req.body.email, (err, user) => {
    if (err) return next(err);
    if (user) {
      User.authentificate(req.body, (err) => {
        if (err) {
          return next(`Ошибка в login.js: ${err}`);
        } else {
          req.session.name = user.name;
          return res.redirect("/");
        }
      });
    } else {
      return res.redirect("/login");
    }
  });
};
