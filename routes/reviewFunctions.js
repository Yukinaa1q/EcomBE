const router = require("express").Router();
const Book = require("../models/book.js");
const User = require("../models/user.js");
const Review = require("../models/review.js");

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Review.findOne({})
      .populate({ path: "book", match: { id: id }, model: "Book" })
      .populate({
        path: "reviews",
        populate: {
          path: "user",
          model: "User",
        },
      });
    if (result.book) {
      res.status(200).json(result);
    } else {
      res.json({ message: "There is no review for this book" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
