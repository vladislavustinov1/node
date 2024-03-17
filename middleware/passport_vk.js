const logger = require("../logs/logger");
const VKontakteStrategy = require("passport-vkontakte").Strategy;
require("dotenv").config();

function passportFunctionVKontakte(passport) {
  passport.serializeUser((user, doneVK) => {
    const newUserVK = {
      id: user.id,
      username: user.displayName,
      age: user.age ? user.age : 18,
      email: user.email ? user.email : "vk_test@gmail.com",
    };
    return doneVK(null, newUserVK);
  });

  passport.deserializeUser(function (id, doneVK) {
    return doneVK(null, id);
  });
  passport.use(
    new VKontakteStrategy(
      {
        clientID: process.env.VKONTAKTE_APP_ID, // VK.com docs call it 'API ID', 'app_id', 'api_id', 'client_id' or 'apiId'
        clientSecret: process.env.VKONTAKTE_APP_SECRET,
        callbackURL: "http://localhost/auth/vkontakte/callback",
      },
      function (accessToken, refreshToken, params, profile, doneVK) {
        process.nextTick(function () {
          logger.info(`Получили профиль от VK ${profile}`);
          return doneVK(null, profile);
        });
      }
    )
  );
}

module.exports = passportFunctionVKontakte;
