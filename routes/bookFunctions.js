const router = require("express").Router();

const Book = require("../models/book.js");

// const getNewID = (lastID) => {
//   const numericPart = parseInt(lastID.slice(2), 10);
//   const nextNumericPart = numericPart + 1;
//   return `LN${nextNumericPart.toString().padStart(5, "0")}`;
// };
router.get("/genre", async (req, res) => {
  try {
    const boks = await Book.distinct("genre");
    if (boks) {
      res.status(200).json(boks);
    } else {
      res.json({ message: "There are no books at the moment" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
router.get("/", async (req, res) => {
  try {
    const finalResult = await Book.find({}).sort({ id: 1 });

    if (finalResult) {
      res.status(200).json(finalResult);
    } else {
      res.json({ message: "There are no books at the moment" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const bok = await Book.findOne({ id }); //.populate("provider");

    if (bok) {
      res.status(200).json(bok);
    } else {
      res.json({ message: "The Book is not exist" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
// router.post("/create", async (req, res) => {
//   const { size, genre, price, name, product_count, provider } = req.body;

//   try {
//     const lastBok = await Book.findOne({}).sort({ id: -1 });
//     const newID = lastBok ? getNewID(lastBok.id) : "LN00001";

//     const bok = await Book.create({
//       id: newID,
//       size,
//       genre,
//       price,
//       name,
//       product_count,
//       provider: newProd._id,
//     });
//     res.status(200).json(bok);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });
// router.put("/:id", async (req, res) => {
//   const { id } = req.params;
//   const { name, genre, size, price, product_count, provider } = req.body;
//   try {
//     const bok = await Book.findOneAndUpdate(
//       { id },
//       {
//         $set: {
//           name,
//           genre,
//           size,
//           price,
//           product_count,
//           "provider.name": provider && provider.name,
//         },
//       }
//     );
//     if (!bok)
//       return res.status(404).json({ message: "There no such book exist" });
//     res.status(200).json(bok);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });
// router.delete("/:id", async (req, res) => {
//   const { id } = req.params;
//   try {
//     const target = await Book.findOne({ id });

//     const bok = await Book.findOneAndDelete({ id });
//     if (!bok) {
//       res.json({ message: "There is no book with this id exits" });
//     }
//     res.status(200).json(bok);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });
module.exports = router;
