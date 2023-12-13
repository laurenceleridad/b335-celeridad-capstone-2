const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  // data types / rules / default value
  userId: {
    type: String,
    required: [true, "User ID is Required"]
  },
  productsOrdered: [
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
  status: {
          type: String,
          default: "Pending"
  }
});

module.exports = mongoose.model("Order", orderSchema);