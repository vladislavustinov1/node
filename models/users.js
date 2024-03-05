const bcrypt = require("bcrypt");
const mysql = require("mysql2");
const RolesUser = require("./userRoles");
const logger = require("../logs/logger");

class User {
  constructor() {}
  static async create(dataFromForm, next, functionForWork) {
    try {
      const connection = mysql.createConnection({
        host: "localhost",
        user: process.env.MYSQL_LOGIN,
        password: process.env.MYSQL_PASSWORD,
      });
      const salt = await bcrypt.hash(dataFromForm.password, 10);
      const hash = await bcrypt.hash(dataFromForm.password, salt);
      const rolesUsers = await RolesUser.roles();
      connection.connect((err) => {
        if (err) throw err;
        connection.query(`USE usersdb`, (err) => {
          if (err) throw err;
        });
        connection.query(
          `INSERT INTO users (username, password, email, age, secret_word, rolesUser) VALUES (?, ?, ?, ?, ?, ?);`,
          [
            dataFromForm.name,
            hash,
            dataFromForm.email,
            dataFromForm.age,
            dataFromForm.secret_word,
            rolesUsers,
          ],
          functionForWork
        );
        connection.end();
      });
    } catch (error) {
      logger.error(`Ошибка в модуле создания пользователя: ${error}`);
      return next(error);
    }
  }
  static async findByEmail(dataFromForm, functionForWork) {
    const connection = mysql.createConnection({
      host: "localhost",
      user: process.env.MYSQL_LOGIN,
      password: process.env.MYSQL_PASSWORD,
    });
    connection.connect((err) => {
      if (err) throw err;
      connection.query(`USE usersdb`, (err) => {
        if (err) throw err;
      });
      connection.query(
        `SELECT * FROM users WHERE email = ?`,
        [dataFromForm],
        functionForWork
      );
      connection.end();
    });
  }
  static authenticate(dataFromForm, functionForWork) {
    User.findByEmail(dataFromForm.email, (err, searchUser) => {
      if (err) return console.error(err);
      if (searchUser < 1) {
        return next("Пользователь не найден");
      } else {
        let DataBasePassword = searchUser.map((pass) => pass.password);
        DataBasePassword = DataBasePassword.join("");
        const res = bcrypt.compare(
          dataFromForm.password,
          DataBasePassword,
          (err, result) => {
            result
              ? functionForWork(null, searchUser)
              : functionForWork(err, null);
          }
        );
      }
    });
  }
}

module.exports = User;
