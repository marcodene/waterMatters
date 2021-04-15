const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
  },
  waterPrint: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  meal: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
});

const Food = mongoose.model("food", foodSchema);

module.exports = Food;
