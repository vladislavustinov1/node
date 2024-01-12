const express = require("express");
const routes = express.Router();
const register = require("../controllers/registerController");
const login = require("../controllers/login");
const post = require("../controllers/post");
const checkValidity = require("../middleware/validate_data");

routes.get("/", (req, res) => {
  const role = req.session.role;
  res.render("mainPage", {
    title: "Главная",
    role: role,
  });
});

routes.get("/register", register.form);
routes.post("/register", checkValidity, register.registerUser);

routes.get("/login", login.form);
routes.post("/login", login.login);
routes.get("/logout", login.logout);

routes.get("/posts", post.listPosts);
routes.get("/createPost", post.form);
routes.post("/createPost", post.releasePost);
routes.get("/updateCard/:id", post.updatePostForm);
routes.post("/updateCard/:id", post.submitUpdatePost);
routes.get("/deleteCard/:id", post.deletePost);

module.exports = routes;
