const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("test.sqlite");
const sql =
  "CREATE TABLE IF NOT EXISTS users ( id INT PRIMARY KEY AUTO_INCREMENT, email TEXT NOT NULL, password TEXT NOT NULL, age INT NOT NULL";
db.run(sql);
class User {
  constructor() {
    // this.login = login;
    // this.password = password;
  }
  static create(dataForm) {}
  static findByEmail(email) {}
}
