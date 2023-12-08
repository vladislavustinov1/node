const User = require("../models/user");
exports.form = (req, res) => {
  res.render("registerForm", {});
};

exports.submit = (req, res, next) => {
  const userDataForm = req.body;
  User.findByEmail(userDataForm.email, (err, user) => {
    if (err) return next(err);
    if (!user) {
      User.create(userDataForm, (err) => {
        if (err) {
          return next(err);
        }
      });
    } else {
      res.error("Пользователь уже существует");
    }
  });
  res.redirect("/");
};
