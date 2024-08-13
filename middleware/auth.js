const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const generateToken = (userId, role, res) => {
  const token = jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.cookie(process.env.TOKEN_NAME, token, {
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    httpOnly: true,
    secure: false,//process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });
  
};



module.exports = {  generateToken };