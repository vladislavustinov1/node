const User = require("../models/users");
const Role = require("../models/userRoles");

exports.form = (req, res) => {
  const username = req.session.name;
  const role = req.session.role;
  res.render("login", { username: username });
};

exports.login = (req, res, next) => {
  User.authenticate(req.body, (err, user) => {
    if (err) return next(err);
    if (!user) {
      return console.error("Неверный логин или пароль");
    }
    let userName = user.map((name) => name.username);
    let userMail = user.map((mail) => mail.email);
    let userRole = user.map((role) => role.rolesUser);
    req.session.name = userName[0];
    req.session.email = userMail[0];
    req.session.role = userRole[0];
    res.redirect("/");
  });
};
exports.logout = (req, res, next) => {
  if (req.session.name) {
    req.session.destroy((err) => {
      if (err) return next(err);
      res.redirect("/");
    });
  } else {
    return console.error(
      "Не удалось удалить сессию. Возможно, вы не авторизованы"
    );
  }
};
