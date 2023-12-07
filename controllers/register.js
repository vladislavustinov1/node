const User = require("../models/user");
exports.form = (req, res) => {
  res.render("registerForm", {});
};

exports.submit = (req, res, next) => {
  const userDataForm = req.body;
  User.findByEmail(userDataForm.dataForm.email, (err, user) => {
    if (!user) {
      User.create(userDataForm.user, (err) => {
        if (err) {
          return next(err);
        }
      });
    }
  });
  res.error("Пользователь уже существует");
  res.redirect("/");
};
