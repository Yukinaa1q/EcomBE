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
router.get("/:id/:price/setOrder", async (req, res) => {
  const { id, price } = req.params;
  try {
    const fin = await User.findById(id);
    const day = new Date();
    if (!fin) {
      return res.json({ message: "There is no user have this id" });
    }

    fin.order.push({
      totalPrice: price,
      orderdate: day.toLocaleString(),
      cart1: [],
    });

    for (const item of fin.cart) {
      fin.order[fin.order.length - 1].cart1.push({
        product1: item.product,
        quantity1: item.quantity,
      });
    }
    if (fin.order[fin.order.length - 1].cart1.length == 0) {
      return res.json({ message: "You must have some products in cart" });
    }
    fin.cart = [];
    await fin.save();
    res.status(200).json(fin);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
router.get("/:id/checkOrder", async (req, res) => {
  const { id } = req.params;
  try {
    const fin = await User.findById(id);
    if (!fin) {
      return res.json({ message: "There is no user have this id" });
    }

    res.status(200).json(fin.order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
router.put("/:id/:product_id/update", async (req, res) => {
  const { id, product_id } = req.params;
  const { quantity } = req.body;
  try {
    const fin = await User.findById(id);
    if (!fin) {
      return res.json({ message: "There is no user have this id" });
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
      return res.json({ message: "There is no user have this id" });
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
  const { quantity } = req.body;
  try {
    const fin = await User.findById(id);
    if (!fin) {
      return res.json({ message: "There is no user have this id" });
    }

    fin.cart.pull({
      product: product_id,
      quantity: quantity,
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
    const result = await User.findById(id).distinct("shipping");
    if (result) {
      res.status(200).json(result);
    } else {
      res.json({ message: "There is something wrong" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
router.post("/:id/shipping/update", async (req, res) => {
  const { id } = req.params;
  const { address, ship_phone, city, district, ward } = req.body;
  try {
    const result = await User.findById(id);
    if (!result) {
      return res.json({ message: "There is no user having this id" });
    }
    result.shipping = [];
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
module.exports = router;
