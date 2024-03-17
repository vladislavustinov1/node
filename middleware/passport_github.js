const GitHubStrategy = require("passport-github2").Strategy;

function passportFunctionGithub(passport) {
  passport.serializeUser(function (user, doneGT) {
    return doneGT(null, user);
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
