const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  // data types / rules / default value
  userId: {
    type: String,
    required: [true, "User ID is Required"]
  },
  cartItems: [
    {
      productId: {
        type: String,
        required: [true, "Course ID is required"]
      },
      quantity: {
        type: Number,
        required: [true, "Quantity is required"]
      },
      subtotal: {
        type: Number,
        required: [true, "Subtotal is required"]
      }
    },
  ],
  totalPrice: {
    type: Number,
    required: [true, "totalPrice is Required"],
  },
  orderedOn: {
    type: Date,
    default: Date.now, // current date
  },
});

module.exports = mongoose.model("Cart", cartSchema);