const User = require("../models/users");
const logger = require("../logs/logger");
const jwt = require("jsonwebtoken");

exports.form = (req, res) => {
  const username = req.session.name;
  res.render("login", { username: username });
};

exports.login = (req, res, next) => {
  User.authenticate(req.body, (err, user) => {
    if (err) {
      logger.error(`Ошибка в login.js: ${err}`);
    }
    if (!user) {
      logger.info(`Неверный логин или пароль`);
      return console.error("Неверный логин или пароль");
    }
    const userName = user.map((name) => name.username);
    const userMail = user.map((mail) => mail.email);
    const userRole = user.map((role) => role.rolesUser);
    req.session.name = userName[0];
    req.session.email = userMail[0];
    req.session.role = userRole[0];
    const token = jwt.sign(
      {
        name: req.session.name,
      },
      process.env.SECRET_JWT,
      {
        expiresIn: 3600000,
      }
    );
    res
      .cookie("access_token", token, { httpOnly: true, maxAge: 3600000 })
      .redirect("/");
  });
};
exports.logout = (req, res, next) => {
  if (req.session.name) {
    res.clearCookie("access_token");
    req.session.destroy((err) => {
      if (err) {
        logger.error(`Ошибка при попытке выхода из системы: ${err}`);
        next(err);
      }
      res.redirect("/");
    });
  } else {
    return console.error(
      "Не удалось удалить сессию. Возможно, вы не авторизованы"
    );
  }
};
