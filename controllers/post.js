const { Posts } = require("../config/config");
const { v4: uuidv4 } = require("uuid");
const logger = require("../logs/logger");

exports.listPosts = async (req, res, next) => {
  const username = res.locals.user.username;
  const roleUser = req.session.role ? req.session.role : "user";
  const email = res.locals.user.email;
  const post = await Posts.findAll();
  console.log(post);
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
  console.log(req.params);
  const generateUUID = uuidv4();
  await Posts.create({
    uuid: generateUUID,
    title: data.title,
    content: data.content,
    author: username,
    email_author: email,
  });
  await res.redirect("/posts");
};
exports.deletePost = async (req, res, next) => {
  const postId = req.params.uuid;
  await Posts.destroy({
    where: {
      uuid: postId,
    },
  });
  await res.redirect("/posts");
};

exports.updatePostForm = async (req, res) => {
  const postId = req.params.uuid;
  const post = await Posts.findAll({
    where: {
      uuid: postId,
    },
  });
  const username = res.locals.user.username;
  const roleUser = req.session.role ? req.session.role : "user";
  await res.render("updateCard", {
    uuid: postId,
    title: "Изменение поста",
    post: post,
    name: username,
    role: roleUser,
  });
};
exports.submitUpdatePost = async (req, res, next) => {
  const entryId = req.params.uuid;
  const newData = {
    title: req.body.post.title,
    content: req.body.post.content,
  };
  await Posts.update(
    { ...newData },
    {
      where: {
        uuid: entryId,
      },
    }
  );
  await res.redirect("/posts");
};
