const User = require("../models/users");

exports.form = (req, res) => {
  const username = req.session.name;
  res.render("register", { username: username });
};

exports.registerUser = (req, res, next) => {
  User.findByEmail(req.body.email, (err, searchUser) => {
    if (err) return next(err);
    if (searchUser.length > 0) {
      return next("Пользователь уже существует");
    }
    User.create(req.body, next, (err) => {
      if (err) return next(err);
    });
  });
  res.redirect("/");
};
