const express = require("express");
const mysql = require("mysql2");
const favicon = require("express-favicon");
const fs = require("fs");
const path = require("path");
const router = require("./routes/router");
const { nextTick } = require("process");

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
console.log(app.get(`env`));
const port = "3000";

const filePath = path.join(__dirname, "tmp", "1.txt");
const logg = "";

fs.writeFile(filePath, `Сервер запущен.. Порт: ${port}`, (err) => {
  if (err) console.error(err);
  console.log("файл создан");
});

// MySQL server

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
app.get("env") == "production";
console.log(app.get("env"));
if (app.get("env") == "production") {
  app.use((req, res, err) => {
    res.status(err.status);
    res.sendFile(err.message);
  });
}
app.listen(port, () => {
  console.log(`listen on port ${port}`);
});
//err hand
app.use((req, res, next) => {
  const err = new Error("Couldn't get path");
  err.status = 404;
  next(err);
});

if (app.get("env") != "development") {
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
