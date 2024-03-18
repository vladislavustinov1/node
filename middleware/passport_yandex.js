const YandexStrategy = require("passport-yandex").Strategy;

const logger = require("../logs/logger");
require("dotenv").config();

function passportFunctionYandex(passport) {
  passport.serializeUser(function (user, doneYA) {
    console.log("Yandex serialize");
    const newUser = {
      id: user.id,
      username: user.displayName,
      email: Array.isArray(user.emails) ? user.emails[0].value : user.email,
      age: user.birthday ? Date.now() - user.birthday : 20,
    };
    return doneYA(null, newUser);
  });

  passport.deserializeUser((obj, doneYA) => doneYA(null, obj));
  passport.use(
    new YandexStrategy(
      {
        clientID: process.env.YANDEX_CLIENT_ID,
        clientSecret: process.env.YANDEX_CLIENT_SECRET,
        callbackURL: "http://127.0.0.1:80/auth/yandex/callback",
      },
      function (appToken, refreshToken, profile, doneYA) {
        // asynchronous verification, for effect...
        process.nextTick(function () {
          // To keep the example simple, the user's Yandex profile is returned
          // to represent the logged-in user.  In a typical application, you would
          // want to associate the Yandex account with a user record in your
          // database, and return that user instead.
          logger.info(`Получили профиль от Yandex ${profile}`);
          return doneYA(null, profile);
        });
      }
    )
  );
}

module.exports = passportFunctionYandex;
