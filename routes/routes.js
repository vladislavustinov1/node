const express = require("express");
const routes = express.Router();
const register = require("../controllers/registerController");
const login = require("../controllers/login");
const post = require("../controllers/post");
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
routes.get("/updateCard/:id", post.updatePostForm);
routes.post("/updateCard/:id", post.submitUpdatePost);
routes.get("/deleteCard/:id", post.deletePost);

routes.get(
  "/auth/yandex",
  passport.authenticate("yandex"),
  function (req, res) {
    // The request will be redirected to Yandex for authentication, so this
    // function will not be called
  }
);

// GET /auth/yandex/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
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

module.exports = routes;
