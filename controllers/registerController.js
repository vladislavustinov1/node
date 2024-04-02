const { User, Role } = require("../config/config");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const logger = require("../logs/logger");

exports.form = (req, res) => {
  const username = req.session.name;
  res.render("register", { username: username });
};

exports.registerUser = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        email: [req.body.email],
      },
    });
    if (user) {
      logger.error("Пользователь уже зарегистрирован");
      return res.redirect("/");
    } else {
      const generateUUID = uuidv4();
      const searchRole = await Role.findOne({ where: { Role: ["user"] } });
      const rolesUser = searchRole.dataValues.Role;
      const salt = await bcrypt.hash(req.body.password, 10);
      const hash = await bcrypt.hash(req.body.password, salt);
      await User.create({
        uuid: generateUUID,
        username: req.body.name,
        password: hash,
        email: req.body.email,
        registerEmail: req.body.email,
        age: req.body.age,
        secret_word: req.body.secret_word,
        rolesUser: rolesUser,
      });
      req.session.name = req.body.name;
      req.session.email = req.body.email;
      req.session.role = rolesUser;
      return res.redirect("/");
    }
  } catch (error) {
    logger.error(`Ошибка в модуле создания пользователя: ${error}`);
    return console.error(error);
  }
};
