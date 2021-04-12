const express = require("express");
const passport = require("passport");
const router = express.Router();
// Load User model
const User = require("../models/User");
const { forwardAuthenticated } = require("../config/auth");

// Login Page
router.get("/login", forwardAuthenticated, (req, res) => {
  res.render("login");
});

// Register Page
router.get("/register", forwardAuthenticated, (req, res) => {
  res.render("register");
});

// Register
router.post("/register", async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;
  let errors = [];

  if (!username || !email || !password || !confirmPassword) {
    errors.push({ msg: "Please enter all fields" });
  }

  if (password !== confirmPassword) {
    errors.push({ msg: "Passwords do not match" });
  }

  if (password.length < 6) {
    errors.push({ msg: "Passwords must be at least 6 characters" });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      username,
      email,
      password,
      confirmPassword,
    });
  } else {
    try {
      const user =
        (await User.findOne({ email })) || (await User.findOne({ username }));

      if (user) {
        errors.push({ msg: "Email or Username already exists" });
        return res.render("register", {
          errors,
          username,
          email,
          password,
          confirmPassword,
        });
      }
      const newUser = new User({
        username,
        email,
        password,
      });
      newUser.save();

      req.flash("success_msg", "You are now registered and can log in");
      res.redirect("/users/login");
    } catch (e) {
      console.log(e);
      errors.push({ msg: `Unknown error. Please try again` });
      res.render("register", {
        errors,
        username,
        email,
        password,
        confirmPassword,
      });
    }
  }
});

// Login
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/users/login");
});

module.exports = router;
