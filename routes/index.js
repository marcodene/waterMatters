const express = require("express");
const { forwardAuthenticated, ensureAuthenticated } = require("../config/auth");
const router = express.Router();
// Load User model
const User = require("../models/User");
const validateUser = require("../utils/validateUser");

// Welcome Page
router.get("/welcome", forwardAuthenticated, (req, res) => {
  res.render("welcome");
});

// Calculator
router.get("/calculator", ensureAuthenticated, (req, res) =>
  res.render("calculator", {
    user: req.user,
    url: process.env.url,
  })
);

// Main
router.get("/", (req, res) => res.render("main"));

// Contact
router.get("/contact", (req, res) => res.render("contact"));

// Profile
router.get("/profile", ensureAuthenticated, (req, res) => {
  res.render("profile", {
    mode: "profile",
    user: req.user,
    url: process.env.url,
  });
});

// Result
router.get("/result", ensureAuthenticated, (req, res) => {
  res.render("profile", {
    mode: "result",
    user: req.user,
    url: process.env.url,
  });
});

// User profile
router.get("/profile/:id", async (req, res) => {
  const user = await User.findById(req.params.id);

  const validatedUser = validateUser(user, [
    "email",
    "password",
    "friends",
    "foodsEaten",
    "history",
    "updatedAt",
  ]);
  console.log(validatedUser);

  res.render("profile", {
    mode: "id",
    user: validatedUser,
    url: process.env.url,
  });
});

// Friends
router.get("/friends", ensureAuthenticated, (req, res) => {
  res.render("friends", {
    user: req.user,
    url: process.env.url,
    // user: {
    //   _id: { $oid: "6076fae7b8a267402f2b67a0" },
    //   waterPrint: { $numberInt: "0" },
    //   username: "pietrissimo",
    //   email: "pietromicara@hotmail.com",
    //   password:
    //     "$2a$08$khE1bSw6t3qGb3Xm2SG3V.w1b7RCTvl20LwXsLAyWq.HmBhQzxzdG",
    //   friends: [
    //     { _id: { $oid: "6075950d28a17e22f1930f80" }, username: "user1" },
    //     { _id: { $oid: "6075950d28a17e22f1930f80" }, username: "user2" },
    //     { _id: { $oid: "6075950d28a17e22f1930f80" }, username: "user3" },
    //     { _id: { $oid: "6075950d28a17e22f1930f80" }, username: "user4" },
    //     { _id: { $oid: "6075950d28a17e22f1930f80" }, username: "user5" },
    //   ],
    //   foodsEaten: [],
    //   history: [],
    //   createdAt: { $date: { $numberLong: "1618410215598" } },
    //   updatedAt: { $date: { $numberLong: "1618410453982" } },
    //   __v: { $numberInt: "1" },
    // },
  });
});

module.exports = router;
