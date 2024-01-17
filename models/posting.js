const mysql2 = require("mysql2");

class Post {
  constructor() {}
  static create(dataFromForm) {
    const connection = mysql2.createConnection({
      host: "localhost",
      user: "root",
      database: "usersdb",
    });
    connection.connect((err) => {
      if (err) throw err;
      connection.query(
        `INSERT INTO posts(title, content, author, email_author) VALUES (?,?,?,?)`,
        [
          dataFromForm.title,
          dataFromForm.content,
          dataFromForm.username,
          dataFromForm.email,
        ],
        (err) => {
          if (err) throw err;
        }
      );
      connection.end();
    });
  }
  static async selectAll(functionForWork) {
    const connection = mysql2.createConnection({
      host: "localhost",
      user: "root",
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
      user: "root",
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
      user: "root",
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
      user: "root",
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
