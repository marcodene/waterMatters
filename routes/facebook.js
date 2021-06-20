const express = require("express");
const passport = require("passport");
const router = express.Router();

router.get("/facebook", passport.authenticate("facebook"));

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/calculator",
    failureRedirect: "/users/login",
  })
);
module.exports = router;
