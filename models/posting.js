const mysql2 = require("mysql2");
const logger = require("../logs/logger");
const { sequelize, Posts } = require("../config/config");

class Post {
  constructor() {}
  static async create(dataFromForm) {
    try {
      await sequelize.authenticate();
      const post = Posts.create({
        title: dataFromForm.title,
        content: dataFromForm.content,
        author: dataFromForm.username,
        email_author: dataFromForm.email,
      });
      return post;
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
  }
  static async selectAll(functionForWork) {
    await sequelize.authenticate();

    const connection = mysql2.createConnection({
      host: "localhost",
      user: process.env.MYSQL_LOGIN,
      password: process.env.MYSQL_PASSWORD,
      database: "usersdb",
    });
    connection.connect((err) => {
      if (err) throw err;
      connection.query(`SELECT * FROM posts`, functionForWork);
      connection.end();
    });
  }
  static async getPostById(postId, functionForWork) {
    const connection = mysql2.createConnection({
      host: "localhost",
      user: process.env.MYSQL_LOGIN,
      password: process.env.MYSQL_PASSWORD,
      database: "usersdb",
    });
    connection.connect((err) => {
      if (err) throw err;
      connection.query(
        `SELECT * FROM posts WHERE id = ?`,
        postId,
        functionForWork
      );
      connection.end();
    });
  }
  static async deletePost(postId, functionForWork) {
    const connection = mysql2.createConnection({
      host: "localhost",
      user: process.env.MYSQL_LOGIN,
      password: process.env.MYSQL_PASSWORD,
      database: "usersdb",
    });
    connection.connect((err) => {
      if (err) throw err;
      connection.query(
        `DELETE FROM posts WHERE id = ?`,
        postId,
        functionForWork
      );
      connection.end();
    });
  }
  static async updatePost(postId, newPostData, functionForWork) {
    const connection = mysql2.createConnection({
      host: "localhost",
      user: process.env.MYSQL_LOGIN,
      password: process.env.MYSQL_PASSWORD,
      database: "usersdb",
    });
    connection.connect((err) => {
      if (err) throw err;
      connection.query("SELECT * FROM posts WHERE id = ?", postId);
      connection.query(
        "UPDATE posts SET title = ?, content = ? WHERE id = ?",
        [newPostData.title, newPostData.content, postId],
        functionForWork
      );
      connection.end();
    });
  }
}
module.exports = Post;
