const User = require("../models/user");
exports.form = (req, res) => {
  res.render("loginForm", {});
};

exports.submit = (req, res, next) => {
  const userDataForm = req.body;
  User.findByEmail(userDataForm.emailLogin, (err, user) => {
    if (err) return next(err);
    if (user) {
      User.authentificate(userDataForm, (err) => {
        if (err) {
          return next(err);
        }
      });
    }
  });
  res.redirect("/");
};
