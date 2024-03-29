const { User, Role } = require("../config/config");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const logger = require("../logs/logger");

exports.form = (req, res) => {
  const username = req.session.name;
  res.render("register", { username: username });
};

exports.registerUser = async (req, res, next) => {
  await create(req.body, (err, result) => {
    try {
      req.session.name = result.dataValues.username;
      req.session.email = result.dataValues.email;
      req.session.role = result.dataValues.rolesUser;
      res.redirect("/");
    } catch (err) {
      logger.error(`Возникла непредвиденная ошибка: ${err}`);
      return next(err);
    }
  });
};

async function create(dataFromForm, callback) {
  try {
    const user = await User.findOne({
      where: {
        email: [dataFromForm.email],
      },
    });
    if (user) {
      logger.error("Пользователь уже зарегистрирован");
      return callback(null, null);
    } else {
      const generateUUID = uuidv4();
      const searchRole = await Role.findOne({ where: { Role: ["user"] } });
      const rolesUser = searchRole.dataValues.Role;
      console.log(rolesUser);
      const salt = await bcrypt.hash(dataFromForm.password, 10);
      const hash = await bcrypt.hash(dataFromForm.password, salt);
      const user = await User.create(
        {
          uuid: generateUUID,
          username: dataFromForm.name,
          password: hash,
          email: dataFromForm.email,
          registerEmail: dataFromForm.email,
          age: dataFromForm.age,
          secret_word: dataFromForm.secret_word,
          rolesUser: rolesUser,
        },
        callback
      );
      return callback(null, user);
    }
  } catch (error) {
    logger.error(`Ошибка в модуле создания пользователя: ${error}`);
    return console.error(error);
  }
}
