exports.list = (req, res) => {
  const username = req.session.name;
  res.render("entries", { title: "Entries", name: username });
};
