import express from "express";
const app = express();
app.listen(3000, () => {
  console.log(`Сервер прослушивается на порте 3000`);
});
app.get(`/as/`, function (req, res) {
  res.send(`Hello peedoor`);
});
app.post("/as/", function (req, res) {
  console.log(req.body);
});
// import path from "path";
// import { fileURLToPath } from "node:url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
