const router = require("express").Router();
const Book = require("../models/book.js");
const User = require("../models/user.js");

const getTotalprice = (cart) => {
  let total = 0;
  for (const cartitem of cart) {
    total = total + cartitem.price * cartitem.quantity;
  }
  return total;
};
router.get("/filterProducts", async (req, res) => {
  const {
    name,
    price_start,
    price_end,
    quantity_start,
    quantity_end,
    genre_type,
  } = req.query;
  let genre_type1 = genre_type.split(",");
  if (genre_type1[0] == "") {
    genre_type1 = [];
  }
  console.log(genre_type1);
  try {
    const bigArray = await Book.find({}).sort({ _id: 1 });

    let finalResult = [];
    for (const filteredProduct of bigArray) {
      console.log(filteredProduct);
      if (name != "undefined" && filteredProduct.name.indexOf(name) == -1) {
        console.log(1);
        continue;
      }

      if (price_start != "undefined" && filteredProduct.price < price_start) {
        console.log(2);
        continue;
      }
      if (price_end != "undefined" && filteredProduct.price > price_end) {
        console.log(3);
        continue;
      }
      if (
        quantity_start != "undefined" &&
        filteredProduct.product_count < quantity_start
      ) {
        console.log(4);
        continue;
      }
      if (
        quantity_end != "undefined" &&
        filteredProduct.product_count > quantity_end
      ) {
        console.log(5);
        continue;
      }
      let checke = true;
      if (filteredProduct.genre) {
        for (const genre of genre_type1) {
          if (!filteredProduct.genre.includes(genre)) {
            checke = false;
            break;
          }
        }
        console.log(checke);
        console.log(6);
      } else {
        checke = true;
      }

      if (!checke) {
        console.log(7);
        continue;
      }
      finalResult.push(filteredProduct);
    }
    res.json(finalResult);
  } catch (error) {
    res.json({ error: error.message });
  }
});
module.exports = router;
