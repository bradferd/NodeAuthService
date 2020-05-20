const jwt = require("jsonwebtoken");
const User = require("../models/user");
const config = require("../config");

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.sign({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signin = function (req, res, next) {
  // User has already had their email and password auth'd
  // We just need to give them a token
  res.send({ token: tokenForUser(req.user) });
};

exports.signup = function (req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(422)
      .send({ error: "You must provide username and password." });
  }

  // See if a user with the given email exists
  User.findOne({ email }, (err, existingUser) => {
    if (err) {
      return next(err);
    }
    // If a user with email does exist, return an error
    if (existingUser) {
      return res.status(422).send({ error: "Email is in use" });
    }

    // If a user with email does NOT exist, create and save uer record
    const user = new User({
      email,
      password,
    });

    user.save((err) => {
      if (err) {
        return next(err);
      }
      // Respond to request indicating the user was created
      res.json({ token: tokenForUser(user) });
    });
  });
};
