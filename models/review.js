const mongoose = require("mongoose");
const Book = require("./book.js");
const User = require("./user.js");
const Schema = mongoose.Schema;
const reviewSchema = new Schema(
  {
    book: {
      type: Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    reviews: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "Book",
          require: false,
        },
        rate: {
          type: Number,
          require: false,
        },

        review: {
          type: String,
          require: false,
        },
      },
    ],
  },
  { collection: "Reviews", versionKey: false }
);
module.exports = mongoose.model("Review", reviewSchema);
