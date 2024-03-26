const Post = require(`../models/posting`);
const { Posts } = require("../config/config");
const logger = require("../logs/logger");

exports.listPosts = async (req, res, next) => {
  const username = res.locals.user.username;
  const roleUser = req.session.role ? req.session.role : "user";
  const email = res.locals.user.email;
  const post = await Posts.findAll();
  const userData = res.locals.user;
  res.render("posts", {
    title: "List",
    post: post,
    user: userData,
    role: roleUser,
    name: username,
    email: email,
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
  await Posts.create({
    title: data.title,
    content: data.content,
    author: username,
    email_author: email,
  });
  await res.redirect("/posts");
};
exports.deletePost = async (req, res, next) => {
  const postId = req.params.id;
  await Posts.destroy({
    where: {
      id: postId,
    },
  });
  await res.redirect("/posts");
};

exports.updatePostForm = async (req, res) => {
  const postId = req.params.id;
  const username = res.locals.user.username;
  const roleUser = req.session.role ? req.session.role : "user";
  const post = await Posts.findAll({
    where: {
      id: postId,
    },
  });
  await res.render("updateCard", {
    title: "Изменение поста",
    post: post,
    name: username,
    role: roleUser,
  });
};
exports.submitUpdatePost = async (req, res, next) => {
  const entryId = req.params.id;
  const newData = {
    title: req.body.post.title,
    content: req.body.post.content,
  };
  await Posts.update(
    { ...newData },
    {
      where: {
        id: entryId,
      },
    }
  );
  await res.redirect("/posts");
};
