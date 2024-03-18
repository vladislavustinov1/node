const posts = require(`../models/posting`);
const logger = require("../logs/logger");

exports.listPosts = (req, res, next) => {
  const username = res.locals.user.username;
  const roleUser = req.session.role ? req.session.role : "user";
  const email = res.locals.user.email;
  posts.selectAll((err, post) => {
    if (err) {
      logger.error(`Ошибка при выборе всех постов: ${err}`);
      next(err);
    }
    const userData = res.locals.user;
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
  let username = res.locals.user.username;
  let roleUser = req.session.role ? req.session.role : "user";
  res.render("createPost", {
    title: "Опубликовать",
    name: username,
    role: roleUser,
  });
};
exports.releasePost = async (req, res) => {
  const username = res.locals.user.username;
  const email = res.locals.user.email;
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
  const username = res.locals.user.username;
  const roleUser = req.session.role ? req.session.role : "user";
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
