const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const bookSchema = new Schema(
  {
    id: {
      type: String,
      require: true,
    },
    size: {
      type: String,
      require: true,
    },
    genre: { type: Array, require: true },
    price: {
      type: Number,
      require: true,
    },
    name: {
      type: String,
      require: true,
    },
    product_count: {
      type: Number,
      require: true,
    },
    provider: {
      type: Schema.Types.ObjectId,
      ref: "Provider",
      require: true,
    },
  },
  { collection: "Books", versionKey: false }
);
module.exports = mongoose.model("Book", bookSchema);
