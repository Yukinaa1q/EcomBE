const router = require("express").Router();
const Book = require("../models/book.js");
const User = require("../models/user.js");
const Review = require("../models/review.js");

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Review.findOne({ book: id })
      .populate({ path: "book", model: "Book" })
      .populate({
        path: "reviews",
        populate: {
          path: "user",
          model: "User",
        },
      });
    if (result) {
      res.status(200).json(result);
    } else {
      res.json({ message: "There is no review for this book" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
router.post("/:id1/:id2", async (req, res) => {
  const { id1, id2 } = req.params;
  const { review, rate } = req.body;
  try {
    const final = await Review.findOne({ book: id1 });

    if (!final) {
      const newfinal = await Review.create({
        book: id1,
        reviews: [],
      });
      newfinal.reviews.push({
        user: id2,
        rate: rate,
        review: review,
      });
      await newfinal.save();
      res.status(200).json(newfinal);
    } else {
      final.reviews.push({ user: id2, rate: rate, review: review });
      await final.save();
      res.status(200).json(final);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
module.exports = router;
