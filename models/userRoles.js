const mysql = require("mysql2/promise");

class Role {
  constructor() {}
  static async roles() {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: process.env.MYSQL_LOGIN,
      password: process.env.MYSQL_PASSWORD,
      database: "usersdb",
    });

    const [rows, fields] = await connection.query(
      `SELECT * FROM roles WHERE Role = ?`,
      ["user"]
    );
    let res = rows.map((role) => role.Role);
    return res[0];
  }
}

module.exports = Role;
