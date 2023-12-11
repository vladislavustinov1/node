exports.submit = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      return next(err);
    } else {
      return res.redirect("/");
    }
  });
};
