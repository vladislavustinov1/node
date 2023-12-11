const express = require("express");
const routers = express.Router();
const register = require("../controllers/register");
const login = require("../controllers/login");
const logout = require("../controllers/logout");
const entries = require("../controllers/entries");
routers.get("/", entries.list);

routers.get("/register", register.form);
routers.post("/register", register.submit);

routers.get("/login", login.form);
routers.post("/login", login.submit);

routers.get("/logout", logout.submit);

module.exports = routers;
