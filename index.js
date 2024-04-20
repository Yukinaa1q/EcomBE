const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const app = express();
const bookroute = require("./routes/bookFunctions.js");
const userroute = require("./routes/userFunctions.js");
const reviewroute = require("./routes/reviewFunctions.js");
const authroute = require("./routes/authFunction.js");
const paymentroute = require("./routes/paymentFunction.js");
require("dotenv").config();
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:8000",
      "http://localhost:4999",
      "https://book-store-two-cyan.vercel.app",
      "https://japbook-fe.vercel.app",
    ],
    methods: ["GET", "PUT", "POST", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());
//routes
app.use("/auth", authroute);
app.use("/", bookroute);
app.use("/user", userroute);
app.use("/review", reviewroute);
app.use("/payment", paymentroute);
mongoose
  .connect(process.env.MONG_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("Server is listening on port", process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });
