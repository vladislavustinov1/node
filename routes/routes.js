const express = require("express");
const routes = express.Router();
const register = require("../controllers/registerController");
const login = require("../controllers/login");
const post = require("../controllers/post");
const profile = require("../controllers/profile");
const passport = require("passport");
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
routes.get("/updateCard/:uuid", post.updatePostForm);
routes.post("/updateCard/:uuid", post.submitUpdatePost);
routes.get("/deleteCard/:uuid", post.deletePost);

routes.get("/profile/:uuid", profile.getProfile);
routes.post("/profile/:uuid");
routes.post("/profile/:uuid/changeEmail", profile.changeEmail);

routes.get(
  "/auth/yandex",
  passport.authenticate("yandex"),
  function (req, res) {
    // The request will be redirected to Yandex for authentication, so this
    // function will not be called
  }
);
routes.get(
  "/auth/yandex/callback",
  passport.authenticate("yandex", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect("/posts");
  }
);

routes.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);
routes.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/posts",
    failureRedirect: "/login",
  })
);

routes.get("/auth/vkontakte", passport.authenticate("vkontakte"));
routes.get(
  "/auth/vkontakte/callback",
  passport.authenticate("vkontakte", {
    successRedirect: "/posts",
    failureRedirect: "/login",
  })
);

routes.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);
routes.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/posts");
  }
);

module.exports = routes;
