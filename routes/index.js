const express = require("express");
const { forwardAuthenticated, ensureAuthenticated } = require("../config/auth");
const router = express.Router();

// Welcome Page
router.get("/welcome", forwardAuthenticated, (req, res) => {
  res.render("welcome");
});

// Main
router.get("/", ensureAuthenticated, (req, res) =>
  res.render("index", {
    user: req.user,
  })
);

module.exports = router;
