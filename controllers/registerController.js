const User = require("../models/users");
const jwt = require("jsonwebtoken");
const logger = require("../logs/logger");

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
      req.session.email = req.body.email;
      req.session.name = req.body.name;
      console.log(req.session);
    });
    // jwt generation
    const token = jwt.sign(
      {
        username: req.body.email,
        email: req.body.name,
      },
      process.env.SECRET_JWT,
      {
        expiresIn: 3600000,
      }
    );
    res
      .cookie("access_token", token, {
        httpOnly: true,
        maxAge: 3600000,
      })
      .redirect("/");
    logger.info(`Куки: ${req.cookies.access_token}`);
    logger.info(
      `Токен создан для: ${req.body.email}, ${req.body.name}. Значение токена: ${token}`
    );
  });
};
