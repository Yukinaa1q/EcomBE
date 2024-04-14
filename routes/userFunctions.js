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
