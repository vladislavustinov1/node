const posts = require(`../models/posting`);
const logger = require("../logs/logger");

exports.listPosts = (req, res, next) => {
  const username = req.session.name;
  const roleUser = req.session.role;
  const email = req.session.email;
  posts.selectAll((err, post) => {
    if (err) {
      logger.error(`Ошибка при выборе всех постов: ${err}`);
      next(err);
    }
    const userData = req.user;
    res.render("posts", {
      title: "List",
      post: post,
      user: userData,
      role: roleUser,
      name: username,
      email: email,
    });
  });
};
exports.form = (req, res) => {
  let username;
  let roleUser;
  if (req.session.name) {
    username = req.session.name;
    roleUser = req.session.role;
  } else if (req.session.passport) {
    username = req.session.passport.name;
    roleUser = "user";
  }

  res.render("createPost", {
    title: "Опубликовать",
    name: username,
    role: roleUser,
  });
};
exports.releasePost = async (req, res) => {
  const username = req.session ? req.session.name : null;
  const email = req.session.email;
  const data = req.body.entry;
  const entry = {
    username: username,
    title: data.title,
    content: data.content,
    email: email,
  };
  posts.create(entry);
  await res.redirect("/posts");
};
exports.deletePost = async (req, res, next) => {
  const postId = req.params.id;
  posts.deletePost(postId, (err) => {
    if (err) {
      logger.error(`Ошибка при удалении поста: ${err}`);
      next(err);
    }
  });
  await res.redirect("/posts");
};

exports.updatePostForm = (req, res) => {
  const postId = req.params.id;
  const username = req.session.name;
  const roleUser = req.session.role;
  posts.getPostById(postId, async (err, post) => {
    if (err) {
      logger.error(`${err}`);
      return res.redirect("posts");
    }
    await res.render("updateCard", {
      title: "Изменение поста",
      post: post,
      name: username,
      role: roleUser,
    });
  });
};
exports.submitUpdatePost = async (req, res, next) => {
  const entryId = req.params.id;
  const newData = {
    title: req.body.post.title,
    content: req.body.post.content,
  };
  posts.updatePost(entryId, newData, (err) => {
    if (err) {
      logger.error(`Ошибка при создании поста ${err}`);
      next(err);
    }
  });
  await res.redirect("/");
};
