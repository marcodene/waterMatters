const express = require("express");
const passport = require("passport");
const router = express.Router();
// Load User model
const User = require("../models/User");
const { forwardAuthenticated, ensureAuthenticated } = require("../config/auth");
const validateUser = require("../utils/validateUser");

/**
 * @description Login Page
 * @method GET /login
 */
router.get("/login", forwardAuthenticated, (req, res) => {
  res.render("login");
});

/**
 * @description Register Page
 * @method GET /register
 */
router.get("/register", forwardAuthenticated, (req, res) => {
  res.render("register");
});

/**
 * @description Register
 * @method POST /register
 */
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

/**
 * @description Login
 * @method POST /login
 */
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});

/**
 * @description Logout
 * @method GET /logout
 */
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/users/login");
});

/**
 * @description Delete account
 * @method GET /users/delete
 */
router.get("/delete", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user._id);
    req.logout();
    req.flash("success_msg", "Your account has been deleted");
    res.redirect("/users/login");
  } catch (e) {
    res.status(400).send();
  }
});

/**
 * @description Update account
 * @method PATCH /users/edit
 */
router.patch("/edit", async (req, res) => {
  console.log(req.body);
  const updates = Object.keys(req.body);
  console.log("updates: ", updates);
  const allowedUpdates = ["username"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  console.log("isValidOperation: ", isValidOperation);

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid Updates!" });
  }

  try {
    const user = await User.findById(req.user._id);
    console.log("user before: ", user);
    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();
    console.log("user after: ", user);

    res.send(user);
  } catch (e) {
    res.status(400).send();
  }
});

/**
 * @description Search for a new user by its username
 * @method GET /friend/:username
 */
router.get("/friend/:username", ensureAuthenticated, async (req, res) => {
  try {
    const userSearched = await User.findOne({ username: req.params.username });
    if (!userSearched) {
      return res.status(404).send("No user found");
    }

    const userObject = validateUser(userSearched, [
      "email",
      "password",
      "friends",
      "foodsEaten",
      "history",
      "createdAt",
      "updatedAt",
    ]);

    res.send(userObject);
  } catch (e) {
    res.status(400).send(e);
  }
});

/**
 * @description Add a friend by its id
 * @method GET /friend/:id
 */
router.post("/friend/:id", async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const friend = await User.findById(req.params.id);

    if (!friend) {
      return res.status(404).send();
    }

    const isAlreadyFriend = user.friends.some((friend) => {
      return friend._id == req.params.id;
    });

    if (isAlreadyFriend) {
      return res.status(400).send({ error: "The user is already your friend" });
    }

    user.friends = user.friends.concat({
      _id: req.params.id,
      username: friend.username,
    });
    await user.save();

    const friendObject = validateUser(friend, [
      "email",
      "password",
      "age",
      "nationality",
      "friends",
      "foodsEaten",
      "history",
      "tokens",
      "createdAt",
      "updatedAt",
    ]);

    res.send({ friend: friendObject, friends: user.friends });
  } catch (e) {
    res.status(400).send();
  }
});

/**
 *  @description Delete a friend by its id
 *  @method POST /friend/:id
 */
router.delete("/friend/:id", async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const isFriend = user.friends.some((friend) => friend._id == req.params.id);

    if (!isFriend) {
      return res.status(404).send("No friend found with this id");
    }

    user.friends = user.friends.filter((friend) => {
      return friend._id != req.params.id;
    });
    await user.save();
    res.send(user.friends);
  } catch (e) {
    res.status(400).send();
  }
});

//TODO: add operations for food: add a meal and set each food in the foodHistory

module.exports = router;
