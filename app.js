const express = require(`express`);
const favicon = require(`express-favicon`);
const path = require(`path`);
const fs = require("fs");
const app = express();
let date = new Date();
app.use(express.static(path.join(__dirname, `public`)));
console.log(__dirname + "/public/1.png");
app.use(favicon(__dirname + "/public/1.png"));
const port = "3000";
app.get("/", function (req, res) {
  fs.writeFile("1.txt", `Клиент зашёл на сервер в ${date}`);
  res.sendFile(__dirname + "/public/index.html");
});
app.listen(port, () => {
  console.log(`Сервер прослушивается на порте ` + port);
});
// app.post("/as/", function (req, res) {
//   console.log(req.body);
// });

// import { fileURLToPath } from "node:url";
// import express from "express";
// import favicon from "express-favicon";
// // import path from "path";
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
