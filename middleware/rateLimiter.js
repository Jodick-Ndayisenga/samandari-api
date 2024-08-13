const Session = require("../models/session.model");
const User = require("../models/user.model");

const rateLimiter = async (req, res, next) => {
  const { email } = req.body;
  const ip = req.ip;
  let session;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(200).json({ email: "Email does not exist" });
  }

  session = await Session.findOne({ userId: user._id, ip });
  if (!session) {
   session =  new Session({
      userId: user._id,
      role: user.isAdmin ? "admin" : "user",
      ip: ip,
      lockUntil: Date.now()
    })

    await session.save();
  }
  if (session && session.isLocked && Date.now() < session.lockUntil) {
    return res.status(200).json({ lockUntil: session.lockUntil });
  }

  req.session = session;
  req.user = user;
  next();
};

module.exports = rateLimiter;
