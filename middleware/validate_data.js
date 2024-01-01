const register = require(`../controllers/registerController`);

module.exports = (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: `Все поля должны быть заполнены` });
  }

  if (!isValidPassword(password)) {
    res.status(400).json({
      error: `Ваш пароль должен быть больше 8 символов, содержать заглавные буквы и цифры и иметь спец. символ`,
    });
    return res.redirect(`/login`);
  }
  if (!validateEmail(email)) {
    res.status(400).json({ error: "Введите правильную почту" });
    return res.redirect(`/login`);
  }
  next();
};

function validateEmail(email) {
  const emailPattern =
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;
  return emailPattern.test(email);
}
function isValidPassword(pass) {
  const passPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;
  return passPattern.test(pass);
}
