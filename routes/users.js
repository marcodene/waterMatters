const express = require("express");
const passport = require("passport");
const router = express.Router();
const axios = require("axios");
// Load User model
const User = require("../models/User");
const { forwardAuthenticated, ensureAuthenticated } = require("../config/auth");
const validateUser = require("../utils/validateUser");

/**
 * @description Login Page
 * @method GET /users/login
 */
router.get("/login", forwardAuthenticated, (req, res) => {
  res.render("login");
});

/**
 * @description Register Page
 * @method GET /users/register
 */
router.get("/register", forwardAuthenticated, (req, res) => {
  res.render("register");
});

/**
 * @description Register
 * @method POST /users/register
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
 * @method POST /users/login
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
 * @method GET /users/logout
 */
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/users/login");
});

/**
 * @description Delete account
 * @method GET /users/users/delete
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
  const updates = Object.keys(req.body);
  const allowedUpdates = ["username"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid Updates!" });
  }

  try {
    const user = await User.findById(req.user._id);
    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();

    res.send(user);
  } catch (e) {
    res.status(400).send();
  }
});

/**
 * @description Get friend's waterPrint
 * @method GET /users/friends
 */
router.get("/friends", ensureAuthenticated, async (req, res) => {
  try {
    const waterPrints = await Promise.all(
      req.user.friends.map(async (friend) => {
        const user = await User.findById(friend._id);
        return user.waterPrint;
      })
    );
    res.send(waterPrints);
  } catch (e) {
    res.status(400).send(e);
  }
});

/**
 * @description Search for a user by its username
 * @method GET /users/friend/:username
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
 * @method POST /users/friend/:id
 */
router.post("/friend/:id", async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const friend = await User.findById(req.params.id);

    const searchingYourself = friend._id === user._id;

    if (searchingYourself) {
      return res.status(400).send();
    }

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
 *  @method DELETE /users/friend/:id
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

/**
 *  @description Add a meal to user history and for each food adding it the foodsEaten list and adding their water footprint to the total
 *  @method POST /users/history
 */
router.post("/history", async (req, res) => {
  console.log(req.body);
  try {
    const user = await User.findById(req.user._id);

    // Check if the ids provided exist in the food database, otherwise a 404 Error will be thrown
    await axios({
      method: "get",
      url: `http://localhost:3000/api/food`,
      data: req.body,
    });

    // Adding the new meal to user's history
    user.history = user.history.concat({
      foods: req.body,
      date: Date.now(),
    });

    let waterPrintAdded = 0;

    // Adding each food of the meal to the foodsEaten list and updating the waterPrint value
    for (let foodToAdd of req.body) {
      let hasAlreadyBeenEaten = false;
      console.log(foodToAdd);

      // Updating the user's waterPrint value
      const response = await axios.get(
        `http://localhost:3000/api/food/${foodToAdd.foodId}`
      );
      await User.findOneAndUpdate(
        { _id: user._id },
        {
          $inc: {
            waterPrint: parseInt(response.data.waterPrint) * foodToAdd.portions,
          },
        }
      );

      waterPrintAdded +=
        parseInt(response.data.waterPrint) * foodToAdd.portions;
      console.log(waterPrintAdded);

      // Checking if there are any item in foodsEaten list and if not we are sure that the food has never been eaten
      if (user.foodsEaten.length != 0) {
        // Checking if the foodId matches any food inside foodsEaten list
        hasAlreadyBeenEaten = user.foodsEaten.some(
          (food) => food.foodId == foodToAdd.foodId
        );
      }
      if (!hasAlreadyBeenEaten) {
        // Pushing the foodId provided by the user and its portion to the foodsEaten list
        user.foodsEaten.push({
          foodId: foodToAdd.foodId,
          timesEaten: foodToAdd.portions,
        });
      } else {
        // Since the foodId already exists in the foodsEaten list we have to find its position
        const foodIndex = user.foodsEaten.findIndex(
          (food) => food.foodId == foodToAdd.foodId
        );
        user.foodsEaten[foodIndex].timesEaten += foodToAdd.portions;
      }
    }

    console.log(user.history[user.history.length - 1]);
    console.log(waterPrintAdded);
    user.history[user.history.length - 1].waterPrint = waterPrintAdded;
    console.log(user);

    await user.save();
    res.send({
      history: user.history,
    });
  } catch (e) {
    res.status(400).send();
  }
});

/**
 *  @description getting user's footprint
 *  @method GET /users/water-print
 */
router.get("/water-print", async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.send(`${user.waterPrint}`);
  } catch (e) {
    res.status(400).send();
  }
});

module.exports = router;
