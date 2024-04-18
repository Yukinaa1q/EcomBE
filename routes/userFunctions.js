const router = require("express").Router();
const { mongoose } = require("mongoose");
const Book = require("../models/book.js");
const User = require("../models/user.js");

const getTotalprice = (cart) => {
  let total = 0;
  for (const cartitem of cart) {
    total = total + cartitem.price * cartitem.quantity;
  }
  return total;
};
router.put("/:id/:product_id/update", async (req, res) => {
  const { id, product_id } = req.params;
  const { quantity } = req.body;
  try {
    const fin = await User.findById(id);
    if (!fin) {
      res.json({ message: "There is no user have this id" });
    }
    for (let item of fin.cart) {
      if (product_id == item.product) {
        item.quantity = parseInt(quantity);
        break;
      }
    }
    await fin.save();
    res.status(200).json(fin);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
router.post("/:id/:product_id", async (req, res) => {
  const { id, product_id } = req.params;
  const { quantity } = req.body;
  try {
    const fin = await User.findById(id);
    if (!fin) {
      res.json({ message: "There is no user have this id" });
    }
    const p = new mongoose.Types.ObjectId(product_id);
    fin.cart.push({
      product: product_id,
      quantity: parseInt(quantity),
    });
    await fin.save();
    res.json(fin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.delete("/:id/:product_id", async (req, res) => {
  const { id, product_id } = req.params;
  try {
    const fin = await User.findbyID(id);
    if (!fin) {
      res.json({ message: "There is no user have this id" });
    }

    fin.cart.pull({
      _id: product_id,
    });
    await fin.save();
    res.json(fin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get("/:id/shipping", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await User.findOne({ id }).distinct("shipping");
    if (result) {
      res.status(200).json(result);
    } else {
      res.json({ message: "There is something wrong" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
router.post("/:id/shipping", async (req, res) => {
  const { id } = req.params;
  const { address, ship_phone, city, district, ward } = req.body;
  try {
    const result = await User.findOne({ id });
    if (!result) {
      return res.json({ message: "There is no user having this id" });
    }
    result.shipping.push({
      address: address,
      ship_phone: ship_phone,
      city: city,
      district: district,
      ward: ward,
    });
    await result.save();
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await User.findById(id).populate({
      path: "cart",
      populate: {
        path: "product",
        model: "Book",
      },
    });
    if (result) {
      res.status(200).json(result);
    } else {
      res.json({ message: "There is no such user" });
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
    quantity_start,
    quantity_end,
    genre_type,
    page,
    limit,
  } = req.query;
  let genre_type1 = genre_type.split(",");
  if (genre_type1[0] == "") {
    genre_type1 = [];
  }
  const skip = (page - 1) * limit;
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
    finalResult.skip(skip).limit(limit).exec();

    res.json(finalResult);
  } catch (error) {
    res.json({ error: error.message });
  }
});
module.exports = router;
