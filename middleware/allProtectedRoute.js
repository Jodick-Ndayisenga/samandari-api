const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const Session = require("../models/session.model");

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies[process.env.TOKEN_NAME]; // Extract the token
    if (!token) {
      console.log("Token not found");
      return res.status(401).json({ valid: false });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      console.log("Invalid token");
      res.cookie(process.env.TOKEN_NAME, "", { maxAge: 0, httpOnly: true, secure: process.env.NODE_ENV === 'production' });
      return res.status(401).json({ valid: false });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ error: "User not found" });
    }

    const session = await Session.findOne({ userId: user._id });
    if (!session || session.isLocked) {
      console.log("Session invalid or locked");
      res.cookie(process.env.TOKEN_NAME, "", { maxAge: 0, httpOnly: true, secure: process.env.NODE_ENV === 'production' });
      return res.status(401).json({ valid: false });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protectRoute middleware: ", error.message);
    res.cookie(process.env.TOKEN_NAME, "", { maxAge: 0, httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    return res.status(500).json({ error: "Internal server error" });
  }
};

// const verifyTokenAndSession = async (req, res) => {
//   try {
//     const token = req.cookies[process.env.TOKEN_NAME]; // Extract the token
//     if (!token) {
//       console.log("Token not found for verification");
//       res.cookie(process.env.TOKEN_NAME, "", { maxAge: 0, httpOnly: true, secure: process.env.NODE_ENV === 'production' });
//       return res.status(401).json({ valid: false });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     if (!decoded) {
//       console.log("Invalid token for verification");
//       res.cookie(process.env.TOKEN_NAME, "", { maxAge: 0, httpOnly: true, secure: process.env.NODE_ENV === 'production' });
//       return res.status(401).json({ valid: false });
//     }

//     const user = await User.findById(decoded.userId);
//     if (!user) {
//       console.log("User not found for verification");
//       res.cookie(process.env.TOKEN_NAME, "", { maxAge: 0, httpOnly: true, secure: process.env.NODE_ENV === 'production' });
//       return res.status(401).json({ valid: false });
//     }

//     const session = await Session.findOne({ userId: user._id });
//     if (!session || session.isLocked) {
//       console.log("Session invalid or locked for verification");
//       res.cookie(process.env.TOKEN_NAME, "", { maxAge: 0 });
//       return res.status(401).json({ valid: false });
//     }
//     return res.status(200).json({ valid: true });
//   } catch (error) {
//     console.log("Error in verifyTokenAndSession middleware: ", error.message);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };
const verifyTokenAndSession =async (req, res) => {
  try {
    const {userId} = req.body
    const session = await Session.findOne({userId: userId});
    if(session){
      return res.status(200).json({ valid: true });
    }else{
      return res.status(401).json({ valid: false });
    }
  } catch (error) {
    console.log("Error in verifyTokenAndSession middleware: ", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
}

const verifyAdmin = async (req, res, next) => {
 try {
  const {userId} = req.params;
  const user = await User.findById(userId);
  if (!user) {
   return res.status(404).json({ error: "User not found" });
  }
  if (!user.isAdmin) {
   return res.status(403).json({ error: "Unauthorized" });
  }
  const session = await Session.findOne({ userId: user._id });
  if (!session || session.isLocked) {
   return res.status(401).json({ error: "Unauthorized" });
  }
  if(session.role.toLowerCase() === "admin"){
    req.user = user;
    next();
  }

 } catch (error) {
  console.log(error);
  res.status(500).json({ error: "Internal server error" });
 }
};

module.exports = { protectRoute, verifyTokenAndSession, verifyAdmin };
