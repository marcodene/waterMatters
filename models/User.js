const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const findOrCreate = require("mongoose-findorcreate");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
    },
    password: {
      type: String,
      trim: true,
      validate(value) {
        if (value.length < 6) {
          throw new Error("Password must be at least 6 characters");
        }
      },
    },
    googleId: {
      type: String,
    },
    facebookId: {
      type: String,
    },
    friends: [
      {
        username: { type: String },
        friendId: { type: mongoose.ObjectId },
      },
    ],
    waterPrint: { type: Number, default: 0 },
    foodsEaten: [
      {
        foodId: { type: mongoose.ObjectId },
        timesEaten: { type: Number },
      },
    ],
    history: [
      {
        date: { type: Date },
        waterPrint: { type: Number, default: 0 },
        foods: [
          {
            foodId: { type: mongoose.ObjectId },
            portions: { type: Number, default: 1 },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

// Finding a user with same email and comparing passwords
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) throw "Email or password are wrong";

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) throw "Email or password are wrong";

  return user;
};

userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
});

userSchema.method.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;

  return userObject;
};

userSchema.plugin(findOrCreate);

const User = mongoose.model("User", userSchema);
module.exports = User;
