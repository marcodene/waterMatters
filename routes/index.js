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
router.get(
  "/profile",
  /*ensureAuthenticated,*/ (req, res) => {
    res.render("profile", {
      //user: req.user,
      user: {
        waterPrint: 1610,
        _id: "6076f0070b98032a6588f783",
        username: "user1",
        email: "user1@gmail.com",
        friends: [],
        foodsEaten: [
          {
            _id: "60789571b801b6817d66338f",
            foodId: "60759e5a5ac9172ee2617c42",
            timesEaten: 10,
          },
          {
            _id: "60789652a1aaa583f558ffe7",
            foodId: "60759e5a5ac9172ee2617c48",
            timesEaten: 14,
          },
          {
            _id: "607899fd8bb01887f830d4ce",
            foodId: "60759e5a5ac9172ee2617c49",
            timesEaten: 7,
          },
        ],
        history: [
          {
            _id: "60789570b801b6817d66338d",
            foods: [Array],
            date: "2021-04-15T19:35:12.969Z",
          },
          {
            _id: "60789651a1aaa583f558ffe4",
            foods: [Array],
            date: "2021-04-15T19:38:57.654Z",
          },
          {
            _id: "60789761a1aaa583f558ffe8",
            foods: [Array],
            date: "2021-04-15T19:43:29.827Z",
          },
          {
            _id: "607899fc8bb01887f830d4cb",
            foods: [Array],
            date: "2021-04-15T19:54:36.924Z",
          },
        ],
        createdAt: "2021-04-14T13:37:11.137Z",
        updatedAt: "2021-04-15T19:54:37.634Z",
        __v: 6,
      },
    });
  }
);

// Main
router.get("/main", (req, res) => res.render("main"));

module.exports = router;
