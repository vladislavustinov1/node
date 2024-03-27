const { User } = require("../config/config");
const bcrypt = require("bcrypt");
const logger = require("../logs/logger");

exports.form = (req, res) => {
  const username = req.session.name ?? "Аноним";
  res.render("login", { username: username });
};

async function authenticate(dataFromForm, functionForWork) {
  try {
    console.log(dataFromForm);
    const user = await User.findOne({
      where: {
        email: [dataFromForm.email],
      },
    });
    if (user < 1) {
      return functionForWork("Пользователь не найден", null);
    } else {
      bcrypt.compare(
        dataFromForm.password,
        user.dataValues.password,
        (err, result) => {
          if (result) return functionForWork(null, user);
          return functionForWork(err, null);
        }
      );
    }
  } catch (err) {
    console.error(err);
  }
}

exports.login = async (req, res, next) => {
  await authenticate(req.body, (err, result) => {
    if (err === "Пользователь не найден") {
      logger.error("Пользователь не найден");
      console.error(err);
      return res.redirect("/login");
    }
    if (err) {
      logger.error(`Ошибка в login.js: ${err}`);
    }
    if (!result) {
      logger.info(`Неверный логин или пароль`);
      res.redirect("/login");
      return console.error("Неверный логин или пароль");
    }
    req.session.name = result.dataValues.username;
    req.session.email = result.dataValues.email;
    req.session.role = result.dataValues.rolesUser;
    res.redirect("/");
  });
};

exports.logout = (req, res, next) => {
  res.clearCookie("jwt");
  res.clearCookie("connect.sid");
  req.session.destroy((err) => {
    if (err) {
      logger.error(`Ошибка при попытке выхода из системы: ${err}`);
      next(err);
    }
    res.redirect("/");
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
