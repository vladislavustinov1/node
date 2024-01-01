const bcrypt = require("bcrypt");
const mysql = require("mysql2");
const RolesUser = require("./userRoles");

class User {
  constructor() {}
  static async create(dataFromForm, next, functionForWork) {
    try {
      const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "Ou08194321003456123",
      });
      const salt = await bcrypt.hash(dataFromForm.password, 10);
      const hash = await bcrypt.hash(dataFromForm.password, salt);
      let rolesUsers = await RolesUser.roles();
      connection.connect((err) => {
        if (err) throw err;
        connection.query(`USE usersdb`, (err, res) => {
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
      return next(`Ошибка в модуле создания пользователя: ${error.message}`);
    }
  }
  static async findByEmail(dataFromForm, functionForWork) {
    const connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "Ou08194321003456123",
    });
    connection.connect((err) => {
      if (err) throw err;
      connection.query(`USE usersdb`, (err, res) => {
        if (err) throw err;
      });
      connection.query(
        `SELECT * FROM users WHERE email = ?`,
        dataFromForm,
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
          (err, res) => {
            if (res) return functionForWork(null, searchUser);
            return functionForWork(err, null);
          }
        );
      }
    });
  }
}

module.exports = User;
