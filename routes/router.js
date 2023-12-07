const express = require("express");
const path = require("path");
const fs = require("fs");
const routers = express.Router();
const register = require("../controllers/register");
const login = require("../controllers/login");
const routeTest = "/test";
const routeSlash = "/";

const filePath = path.join(__dirname, "tmp", "1.txt");
const port = 3000;
routers.get(routeSlash, function (req, res) {
  logger(port, routeSlash);
  res.end("/");
});
routers.post(routeSlash, function (req, res) {
  logger(port, routeSlash);
  res.end("/");
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
routers.get("/register", register.form);
routers.post("/register", register.submit);

routers.get("/login", login.form);
routers.post("/login", login.submit);

routers.get(routeTest, (req, res) => {
  logger(port, routeTest);
  res.end("/test");
});
routers.post(routeTest, (req, res) => {
  console.log("Прошли по пути post/test");
  logger(port, routeTest);
  res.end("/post/test");
});
console.log(__dirname + "/public/favicon.ico");
routers.get(routeSlash, function (req, res) {
  logger(port, routeSlash);
  res.end();
});
console.log(__dirname + "/public/favicon.ico");

module.exports = routers;
