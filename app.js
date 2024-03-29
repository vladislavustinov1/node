const express = require("express");
const session = require("express-session");
const userSession = require("./middleware/user_session");
const path = require("path");
const favicon = require("express-favicon");
const routes = require("./routes/routes");
const logger = require("./logs/logger");
const passport = require("passport");
const passportFunctionYandex = require("./middleware/passport_yandex");
const passportFunctionGoogle = require("./middleware/passport_google");
const passportFunctionVKontakte = require("./middleware/passport_vk");
const passportFunctionGithub = require("./middleware/passport_github");
const cookieSession = require("cookie-parser");
const { sequelize } = require("./config/config");

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
const port = "80";
require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: `aboba`,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(cookieSession());
app.use(userSession);

app.use(passport.initialize());
app.use(passport.session());

passportFunctionGithub(passport);
passportFunctionYandex(passport);
passportFunctionGoogle(passport);
passportFunctionVKontakte(passport);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "css")));
app.use(express.static(path.join(__dirname, "images")));
app.use("/images", express.static(__dirname + "images"));
app.use(
  "/css/bootstrap.css",
  express.static(
    path.join(
      __dirname,
      "public/css/bootstrap-5.3.2/dist/css/bootstrap.min.css"
    )
  )
);
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(routes);

app.listen(port, async () => {
  await sequelize.sync();
  console.log(`Server running on port ${port}`);
});
