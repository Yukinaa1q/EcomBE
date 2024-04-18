const User = require("../models/user.js");
require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.userVerification = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ status: false, message: "Unauthorized" });
  }
  jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
    if (err) {
      return res.json({ status: false });
    } else {
      const user = await User.findById(data._id);
      if (user) {
        res.locals.user = user; // Optionally, you can pass the user to the next middleware

        return next(); // Call next to proceed to the next middleware
      } else return res.json({ status: false });
    }
  });
};

// module.exports.userAuthorization = (req, res, next) => {
//   const token = req.cookies.token;
//   if (!token) {
//     return res.json({ status: false, message: "Unauthorized" });
//   }
//   jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
//     if (err) {
//       return res.json({ status: false });
//     } else {
//       const user = await Employee.findById(data._id);
//       if (user.role !== "admin")
//         res
//           .status(401)
//           .json({ status: false, message: "This account is unauthorized" });
//       if (user) {
//         res.locals.user = user;
//         // Optionally, you can pass the user to the next middleware
//         return next(); // Call next to proceed to the next middleware
//       } else return res.json({ status: false });
//     }
//   });
// };
