const { Posts, User } = require("../config/config");
const logger = require("../logs/logger");

exports.getProfile = async (req, res, next) => {
  if (Object.keys(res.locals).length > 0) {
    const userPosts = await Posts.findAll({
      where: { email_author: res.locals.user.email },
    });
    const userData = await User.findOne({
      where: { uuid: res.locals.user.uuid },
    });
    console.log(res.locals.user);
    return res.render(`profile`, {
      title: `${res.locals.user.username}`,
      username: res.locals.user.username,
      role: res.locals.user.rolesUser,
      posts: userPosts,
      avatar: res.locals.user.avatar,
      statusUser:
        userData.dataValues.statusUser > 0
          ? userData.dataValues.statusUser
          : "Тут пустовато...",
    });
  } else {
    console.error("Пользователь не авторизован");
    return res.redirect("/");
  }
};
exports.changeEmail = async (req, res, next) => {
  const currentEmail = req.body.currentEmail;
  const newEmail = req.body.newEmail;
  const user = await User.findOne({ where: { email: res.locals.user.email } });
  if (user.email === currentEmail && res.locals.user.entryType === "form") {
    await User.update({ email: newEmail }, { where: { email: currentEmail } });
    await Posts.update({ email: newEmail }, { where: { email: currentEmail } });
    res.locals.user.email = req.session.email = newEmail;
    return res.redirect(".");
  } else if (res.locals.user.entryType === "passport") {
    logger.error("Нельзя сменить почту при входе через сторонние источники!");
    return res.redirect(".");
  } else if (user.email !== currentEmail) {
    logger.error("Неправильно введена почта");
    return res.redirect(".");
  }
};
