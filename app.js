const express = require("express");
const session = require("express-session");
const userSession = require("./middleware/user_session");
const path = require("path");
require("dotenv").config();
const favicon = require("express-favicon");
const routes = require("./routes/routes");
const logger = require("./logs/logger");
const passport = require("passport");
const passportFunction = require("./middleware/passport");
const cookieSession = require("cookie-parser");
const jwt = require("jsonwebtoken");

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
const port = "3000";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: `aboba`,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
passportFunction(passport);
app.use(passport.session());

app.use(cookieSession());
app.use(userSession);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "css")));
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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
