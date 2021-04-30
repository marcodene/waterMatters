const LocalStrategy = require("passport-local").Strategy;
var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
FacebookStrategy = require("passport-facebook").Strategy;
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

// Load User model
const User = require("../models/User");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      // Match user
      User.findOne({
        email: email,
      }).then((user) => {
        if (!user) {
          return done(null, false, { message: "That email is not registered" });
        }

        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) done(err);
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Password incorrect" });
          }
        });
      });
    })
  );

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.googleID,
        clientSecret: process.env.googleSecret,
        callbackURL: "http://localhost:3000/google/callback",
      },
      function (accessToken, refreshToken, profile, done) {
        User.findOrCreate(
          {
            googleId: profile.id,
            username: profile._json.name,
            email: profile._json.email,
          },
          function (err, user) {
            return done(err, user);
          }
        );
      }
    )
  );

  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.facebookID,
        clientSecret: process.env.facebookSecret,
        callbackURL: "http://localhost:3000/facebook/callback",
      },
      function (accessToken, refreshToken, profile, done) {
        User.findOrCreate(
          {
            facebookId: profile.id,
            username: profile._json.name,
            email: profile._json.email,
          },
          function (err, user) {
            if (err) {
              return done(err);
            }
            done(null, user);
          }
        );
      }
    )
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      const userObject = user.toObject();

      delete userObject.password;
      delete userObject.googleId;
      delete userObject.facebookId;

      done(err, userObject);
    });
  });
};
