const router = require("express").Router();
const User = require("../models/user.js");
const jwt = require("jsonwebtoken");
const createSecretToken = (_id) => {
  return jwt.sign({ _id }, process.env.TOKEN_KEY, {
    expiresIn: 3 * 24 * 60 * 60,
  });
};

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "Incorrect username" });
    }

    //let auth = await bcrypt.compare(password, user.password);
    //console.log(password);
    //console.log(user.password);
    // console.log(auth);
    let auth = false;
    if (password === user.password) {
      auth = true;
    }
    if (!auth) {
      return res.json({ message: "Incorrect password ", success: false });
    }

    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    res.status(201).json({
      message: "User logged in successfully",
      success: true,
      token,
      userid: user._id,
    });
    next();
  } catch (error) {
    console.error(error);
  }
});
router.post("/signup", async (req, res) => {
  const { username, password, email } = req.body;

  try {
    // Check if the username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    // Create a new user and save it to the database
    await User.create({
      username,
      password,
      email,
      cart: [],
      shipping: [],
      order: [],
    });

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;
