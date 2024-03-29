const GitHubStrategy = require("passport-github2").Strategy;
const { User, Role } = require("../config/config.js");
const { v4: uuidv4 } = require("uuid");

function passportFunctionGithub(passport) {
  passport.serializeUser(async function (user, doneGT) {
    console.log(user);
    console.log("Github serialize");
    const emailAndImage = function () {
      const arrayForEmailAndPicture = [];
      if (user.provider == "google") {
        arrayForEmailAndPicture.push(user.email, user.picture);
        return arrayForEmailAndPicture;
      } else if (user.provider == "yandex") {
        arrayForEmailAndPicture.push(user.emails[0].value, undefined);
        return arrayForEmailAndPicture;
      } else if (user.provider == "github") {
        arrayForEmailAndPicture.push(
          user._json.email ? user._json.email : "github.email@gmail.com",
          user._json.avatar_url
        );
        return arrayForEmailAndPicture;
      } else {
        arrayForEmailAndPicture.push(
          "vk.email@gmail.com",
          user._json.photo_200
        );
        return arrayForEmailAndPicture;
      }
    };
    const searchUser = await User.findOne({
      where: { email: emailAndImage()[0] },
    });
    if (!searchUser) {
      const generateUUID = uuidv4();
      const searchRole = await Role.findOne({ where: { Role: ["user"] } });
      const rolesUser = searchRole.dataValues.Role;
      const newUser = {
        uuid: generateUUID,
        username: user.displayName,
        password: null,
        email: emailAndImage()[0],
        age: 18,
        secret_word: "github",
        rolesUser: rolesUser,
        avatar: emailAndImage()[1],
      };
      await User.create(newUser);
      return doneGT(null, newUser);
    } else {
      return doneGT(null, searchUser);
    }
  });
  passport.deserializeUser(function (id, doneVK) {
    return doneVK(null, id);
  });
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "http://127.0.0.1:80/auth/github/callback",
      },
      function (accessToken, refreshToken, profile, doneGT) {
        return doneGT(null, profile);
      }
    )
  );
}

module.exports = passportFunctionGithub;
