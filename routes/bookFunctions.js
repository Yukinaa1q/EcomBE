const router = require("express").Router();

const Book = require("../models/book.js");
const { userVerification } = require("../middlewares/authMiddleware.js");
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
router.get("/home", async (req, res) => {
  try {
    const result = await Book.aggregate([{ $sample: { size: 8 } }]);
    if (result) {
      res.status(200).json(result);
    } else {
      res.json({ message: "There is something wrong" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
router.get("/filterProducts", async (req, res) => {
  const {
    name,
    price_start,
    price_end,
    genre_type,
    order,
    page = 1,
  } = req.query;
  console.log(genre_type);
  let genre_type1;
  if (!genre_type) genre_type1 = [];
  else genre_type1 = genre_type.split(",");
  console.log(genre_type1, name, page);

  try {
    let bigArray;
    const pa = parseInt(page);
    const limit = 9;
    let skip = (pa - 1) * limit;

    // if (order != "undefined" && order == "asc") {
    //   bigArray = await Book.find({}).skip(skip).limit(limit).sort({ price: 1 });
    // } else if (order != "undefined" && order == "desc") {
    //   bigArray = await Book.find({})
    //     .skip(skip)
    //     .limit(limit)
    //     .sort({ price: -1 });
    // } else {
    //   bigArray = await Book.find({}).skip(skip).limit(limit).sort({ _id: 1 });
    // }

    // let finalResult = [];
    // for (const filteredProduct of bigArray) {
    //   console.log(filteredProduct);
    //   if (name != "null" && filteredProduct.name.indexOf(name) == -1) {
    //     console.log(1);
    //     continue;
    //   }

    //   if (price_start != "undefined" && filteredProduct.price < price_start) {
    //     console.log(2);
    //     continue;
    //   }
    //   if (price_end != "undefined" && filteredProduct.price > price_end) {
    //     console.log(3);
    //     continue;
    //   }

    //   let checke = true;
    //   if (filteredProduct.genre) {
    //     for (const genre of genre_type1) {
    //       if (!filteredProduct.genre.includes(genre)) {
    //         checke = false;
    //         break;
    //       }
    //     }
    //     console.log(checke);
    //     console.log(6);
    //   } else {
    //     checke = true;
    //   }

    //   if (!checke) {
    //     console.log(7);
    //     continue;
    //   }
    //   finalResult.push(filteredProduct);
    // }
    // //console.log(finalResult);
    // res.json(finalResult);
    let filter = {};
    if (name && name != "undefined") {
      filter.name = { $regex: new RegExp(name, "i") };
    }
    if (price_start && price_start != "undefined") {
      filter.price = { $gte: parseInt(price_start) };
    }
    if (price_end && price_end != "undefined") {
      filter.price = { ...filter.price, $lte: parseInt(price_end) };
    }
    if (genre_type1.length != 0) {
      filter.genre = { $in: genre_type1 };
    }
    if (order != "undefined" && order == "asc") {
      bigArray = await Book.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ price: 1 });
    } else if (order != "undefined" && order == "desc") {
      bigArray = await Book.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ price: -1 });
    } else {
      bigArray = await Book.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ _id: 1 });
    }
    console.log(filter);
    const fullArray = await Book.find(filter);
    const countFilteredBook = Object.keys(fullArray).length;
    const countTotal = await Book.countDocuments();
    let totalPage = Math.ceil(countTotal / limit);
    bigArray.push({
      page: pa,
      totalFilteredBook: countFilteredBook,
      totalPage: totalPage,
    });
    res.json(bigArray);
  } catch (error) {
    res.json({ error: error.message });
  }
  //}
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
