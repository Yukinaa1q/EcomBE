const mongoose = require("mongoose");
const Book = require("./book.js");
const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    id: {
      type: String,
      require: true,
    },
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
    phone: {
      type: String,
      require: true,
    },
    shipping: [
      {
        address: {
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
          //require: false,
        },
        quality: {
          type: Number,
          //require: false,
        },
        require: false,
      },
    ],
  },
  { collection: "Users", versionKey: false }
);
module.exports = mongoose.model("User", userSchema);
