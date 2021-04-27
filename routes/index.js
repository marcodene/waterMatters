const express = require("express");
const { forwardAuthenticated, ensureAuthenticated } = require("../config/auth");
const router = express.Router();

// Welcome Page
router.get("/welcome", forwardAuthenticated, (req, res) => {
  res.render("welcome");
});

// Index
router.get("/", ensureAuthenticated, (req, res) =>
  res.render("index", {
    user: req.user,
  })
);

// Profile
router.get("/profile", ensureAuthenticated, (req, res) => {
  res.render("profile", {
    user: req.user,
  });
});

// Main
router.get("/main", (req, res) => res.render("main"));

module.exports = router;
