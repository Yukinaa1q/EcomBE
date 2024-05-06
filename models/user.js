const mongoose = require("mongoose");
const Book = require("./book.js");
const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    // id: {
    //   type: String,
    //   require: true,
    // },
    username: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    shipping: [
      {
        address: {
          type: String,
          require: true,
        },
        ward: {
          type: String,
          require: true,
        },
        district: {
          type: String,
          require: true,
        },
        city: {
          type: String,
          require: true,
        },
        ship_phone: {
          type: String,
          require: true,
        },
      },
    ],
    cart: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Book",
          require: false,
        },
        quantity: {
          type: Number,
          require: false,
        },
      },
    ],
    order: [
      {
        cart1: [
          {
            product1: {
              type: Schema.Types.ObjectId,
              ref: "Book",
              require: false,
            },
            quantity1: {
              type: Number,
              require: false,
            },
          },
        ],
        totalPrice: {
          type: Number,
          require: true,
        },
        orderdate: {
          type: Date,
          require: true,
        },
      },
    ],
  },
  { collection: "Users", versionKey: false }
);
module.exports = mongoose.model("User", userSchema);
