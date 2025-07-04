const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User.js");

//register
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!email || !password || !username) {
      return res.json({
        success: false,
        message: "All fields are required to fill",
      });
    }

    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return res.json({
        success: false,
        message: "User already exists! Please Try Again",
      });
    }
    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      username,
      email,
      password: hashPassword,
    });
    await newUser.save();
    res.status(200).json({ success: true, message: "Succesfully registered" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.json({
        success: false,
        message: "Email and password are required",
      });
    }
    const checkUser = await User.findOne({ email });
    if (!checkUser) {
      return res.json({
        success: false,
        message: "User not exists! Please register first",
      });
    }
    const checkPasswordMatch = await bcrypt.compare(
      password,
      checkUser.password
    );
    if (!checkPasswordMatch) {
      return res.json({
        success: false,
        message: "Invalid Credentials! Please Try Again",
      });
    }
    //token
    const token = jwt.sign(
      {
        id: checkUser._id,
        username: checkUser?.username,
        role: checkUser.role,
        email: checkUser.email,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "3d",
      }
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // true in production (HTTPS)
        sameSite: "lax", // or "none" with secure:true for cross-site
        maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days in ms
      })
      .json({
        success: true,
        message: "Successfully Logged In",
        user: {
          id: checkUser._id,
          username: checkUser?.username,
          role: checkUser.role,
          email: checkUser.email,
        },
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//logout
const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token").json({
      success: true,
      message: "Successfully Logged out",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//middleware
const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized user!",
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({
      success: false,
      message: "Unauthorized user!",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  authMiddleware,
};
