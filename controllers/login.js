const User = require("../models/user");
exports.form = (req, res) => {
  res.render("loginForm", {});
};

exports.submit = (req, res, next) => {
  const userDataForm = req.body;
  User.findByEmail(userDataForm.dataForm.email, (err, user) => {
    if (user) {
      User.authentificate(userDataForm.user, (err) => {
        if (err) {
          return next(err);
        }
      });
    }
  });
  res.error("Неправильный логин или пароль");
  res.redirect("/");
};
