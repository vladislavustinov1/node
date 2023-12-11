const express = require("express");
const session = require("express-session");
const mysql = require("mysql2");
const favicon = require("express-favicon");
const path = require("path");
const router = require("./routes/router");
const { nextTick } = require("process");

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
console.log(app.get(`env`));
const port = "3000";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// express-session use
app.use(
  session({
    secret: `secret`,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "CSS")));
app.use(express.static(path.join(__dirname, "views")));
app.use(
  "/css/bootstrap.css",
  express.static(
    path.join(
      __dirname,
      "public/css/bootstrap-5.3.2/dist/css/bootstrap.min.css"
    )
  )
);
app.use(favicon(__dirname + "/public/favicon.ico"));
app.use(router);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

if (app.get("env") == "production") {
  app.use((req, res, err) => {
    res.status(err.status);
    res.sendFile(err.message);
  });
}

//err hand
app.use((req, res, next) => {
  const err = new Error("Couldn't get path");
  err.status = 404;
  next(err);
});

if (app.get("env") != "development" || app.get("")) {
  app.use(function (err, req, res, next) {
    console.log(err.status, err.message);
    res.status = 404;
    let image = new URL(
      "http://photos1.blogger.com/x/blogger2/6533/16720282190093/320/140728/plain.gif"
    );
    res.render("error.ejs", { err, image });
  });
} else {
  app.use(function (err, req, res, next) {
    console.log(app.get("env"), err.status, err.message);
  });
}
