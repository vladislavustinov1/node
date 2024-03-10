const User = require("../models/users");
const jwt = require("jsonwebtoken");
const logger = require("../logs/logger");

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
    // jwt generation
    const token = jwt.sign(
      {
        username: req.body.email,
        email: req.body.name,
      },
      process.env.SECRET_JWT,
      {
        expiresIn: 36000000000,
      }
    );
    logger.info(
      `Токен создан для: ${req.body.email}, ${req.body.name}. Значение токена: ${token}`
    );
    res
      .cookie("jwt", token, { httpOnly: true, maxAge: 36000000000 })
      .redirect("/");
  });
};
exports.logout = (req, res, next) => {
  if (req.session.name) {
    res.clearCookie("jwt");
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
