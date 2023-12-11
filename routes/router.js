const express = require("express");
const routers = express.Router();
const register = require("../controllers/register");
const login = require("../controllers/login");
const entries = require("../controllers/entries");
const routeSlash = "/";

routers.get("/", entries.list);

routers.get("/register", register.form);
routers.post("/register", register.submit);

routers.get("/login", login.form);
routers.post("/login", login.submit);

console.log(__dirname + "/public/favicon.ico");
routers.get(routeSlash, function (req, res) {
  logger(port, routeSlash);
  res.end();
});
console.log(__dirname + "/public/favicon.ico");

module.exports = routers;
