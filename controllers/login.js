const { User } = require("../config/config");
const bcrypt = require("bcrypt");
const logger = require("../logs/logger");

exports.form = (req, res) => {
  const username = req.session.name ?? "Аноним";
  return res.render("login", { username: username });
};

exports.login = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        email: [req.body.email],
      },
    });
    if (user < 1) {
      logger.error("Пользователь не найден");
      return res.redirect("/login");
    } else {
      bcrypt.compare(
        req.body.password,
        user.dataValues.password,
        (err, result) => {
          if (!result) {
            logger.info(`Неверный логин или пароль`);
            console.error("Неверный логин или пароль");
            return res.redirect("/login");
          }
          req.session.name = user.dataValues.username;
          req.session.email = user.dataValues.email;
          req.session.role = user.dataValues.rolesUser;
          return res.redirect("/");
        }
      );
    }
  } catch (err) {
    console.error(err);
  }
};

exports.logout = (req, res, next) => {
  res.clearCookie("jwt");
  res.clearCookie("connect.sid");
  req.session.destroy((err) => {
    if (err) {
      logger.error(`Ошибка при попытке выхода из системы: ${err}`);
      next(err);
    }
    return res.redirect("/");
  });
};

// User.authenticate(req.body, (err, user) => {
//   if (err) {
//     logger.error(`Ошибка в login.js: ${err}`);
//   }
//   if (!user) {
//     logger.info(`Неверный логин или пароль`);
//     return console.error("Неверный логин или пароль");
//   }
//   const userName = user.map((name) => name.username);
//   const userMail = user.map((mail) => mail.email);
//   const userRole = user.map((role) => role.rolesUser);
//   req.session.name = userName[0];
//   req.session.email = userMail[0];
//   req.session.role = userRole[0];
//   // jwt generation
//   const token = jwt.sign(
//     {
//       username: req.body.email,
//       email: req.body.name,
//     },
//     process.env.SECRET_JWT,
//     {
//       expiresIn: 36000000000,
//     }
//   );
//   logger.info(
//     `Токен создан для: ${req.body.email}, ${req.body.name}. Значение токена: ${token}`
//   );
//   res
//     .cookie("jwt", token, { httpOnly: true, maxAge: 36000000000 })
//     .redirect("/");
// });
