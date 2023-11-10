const express = require("express");
const favicon = require("express-favicon");
const fs = require("fs");
const path = require("path");
const { nextTick } = require("process");

const app = express();
const port = "3000";

const routeTest = "/test";
const routeSlash = "/";
const filePath = path.join(__dirname, "tmp", "1.txt");
const logg = ``;

fs.writeFile(filePath, `Сервер запущен. Порт: ${port}`, (err) => {
  if (err) console.error(err);
  console.log("файл создан");
});

function logger(port, router) {
  fs.appendFile(
    filePath,
    `\nЛогируем ping по адресу localhost:${port}${router}. Время: ${new Date()}`,
    (err) => {
      if (err) console.error(err);
      console.log("файл переписан");
    }
  );
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(__dirname + "/public/favicon.ico"));

app.get(routeTest, (req, res) => {
  logger(port, routeTest);
  res.end("/test");
});
app.post(routeTest, (req, res) => {
  console.log("Прошли по пути post/test");
  logger(port, routeTest);
  res.end("post/test");
});
console.log(__dirname + "/public/favicon.ico");
app.get(routeSlash, function (req, res) {
  logger(port, routeSlash);
  res.end();
});
app.get(routeSlash, function (req, res) {
  logger(port, routeSlash);
  res.end("/");
});
app.post(routeSlash, function (req, res) {
  logger(port, routeSlash);
  res.end("/");
});

app.use((req, res, next) => {
  const err = new Error("Couldn't get path");
  err.staus = 404;
  console.log(err);
  next(err);
});

app.use((req, res, next) => {
  const err = new Error("Could't get path");
  err.status = 404;
  console.log(err);
  next(err);
});
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
